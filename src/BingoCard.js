import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, set, onValue, update } from 'firebase/database';

const BINGO_LINES = [
  // Rows
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  // Cols
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];

// IDからサムネイルURLを生成するヘルパー関数
const getThumbnailUrl = (id) => {
  const videoId = id.trim();
  if (videoId.startsWith('sm')) {
    const nicoId = videoId.substring(2);
    // 新しい公式のURL形式を使用
    return `https://tn.smilevideo.jp/smile?i=${nicoId}`;
  }
  // YouTube IDと仮定
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

const BingoCard = ({ projectId, userId, project }) => {
  const [card, setCard] = useState(null);
  // Stateを{id, title}のオブジェクト配列に変更
  const [videoEntries, setVideoEntries] = useState(Array(24).fill({ id: '', title: '' }));
  const [isLoading, setIsLoading] = useState(false);
  const [calledIds, setCalledIds] = useState(new Set());
  const [bingoInfo, setBingoInfo] = useState(null);

  // 参加者のカード情報とビンゴ情報を購読
  useEffect(() => {
    if (!userId) return;
    const participantRef = ref(db, `projects/${projectId}/participants/${userId}`);
    onValue(participantRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.card) setCard(data.card);
      if (data?.bingo) setBingoInfo(data.bingo);
    });
  }, [projectId, userId]);

  // コールされた動画リストを購読
  useEffect(() => {
    const calledVideosRef = ref(db, `projects/${projectId}/calledVideos`);
    onValue(calledVideosRef, (snapshot) => {
      const data = snapshot.val();
      const ids = new Set(Object.values(data || {}).map(v => v.id));
      ids.add('FREE');
      setCalledIds(ids);
    });
  }, [projectId]);

  // ビンゴをチェックする
  useEffect(() => {
    if (card && !bingoInfo) {
      for (const line of BINGO_LINES) {
        if (line.every(index => calledIds.has(card[index].id))) {
          const bingoData = { time: Date.now(), line };
          setBingoInfo(bingoData);
          const participantRef = ref(db, `projects/${projectId}/participants/${userId}`);
          update(participantRef, { bingo: bingoData });
          break;
        }
      }
    }
  }, [card, calledIds, bingoInfo, projectId, userId]);

  const handleInputChange = (index, field, value) => {
    const newEntries = [...videoEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setVideoEntries(newEntries);
  };

  const handleCreateCard = async () => {
    setIsLoading(true);
    const filledEntries = videoEntries.filter(entry => entry.id.trim() && entry.title.trim());
    if (filledEntries.length !== 24) {
      alert('24個すべてのタイトルとIDを入力してください。');
      setIsLoading(false);
      return;
    }

    const newCardData = videoEntries.map(entry => ({
      id: entry.id.trim(),
      title: entry.title.trim(),
      thumbnail: getThumbnailUrl(entry.id),
    }));
    
    newCardData.splice(12, 0, { id: 'FREE', title: 'FREE', thumbnail: '' });

    const cardRef = ref(db, `projects/${projectId}/participants/${userId}/card`);
    await set(cardRef, newCardData);
    setIsLoading(false);
  };

  const handleResetCard = async () => {
    if (window.confirm('本当にカードをリセットしますか？')) {
      const cardRef = ref(db, `projects/${projectId}/participants/${userId}/card`);
      await set(cardRef, null);
      setCard(null); // ローカルのstateもリセットして入力画面に戻す
      setVideoEntries(Array(24).fill({ id: '', title: '' })); // 入力内容もクリア
    }
  };

  const isGamePlaying = project.status === 'playing' || project.status === 'finished';

  if (bingoInfo) return <div className="card"><h2>BINGO!</h2><p>おめでとうございます！</p></div>;

  if (card) {
    return (
      <div>
        <div className="bingo-card-grid">
          {card.map((item, index) => {
            const isCalled = calledIds.has(item.id);
            return (
              <div key={index} className={`bingo-cell ${isCalled ? 'called' : ''} ${item.id === 'FREE' ? 'free' : ''}`}>
                {item.id !== 'FREE' && <img src={item.thumbnail} alt={item.title} />}
                <p>{item.title}</p>
              </div>
            );
          })}
        </div>
        {!isGamePlaying && (
          <button onClick={handleResetCard} style={{marginTop: '20px', backgroundColor: '#f0ad4e'}}>
            カードをリセット
          </button>
        )}
      </div>
    );
  }

  if (isGamePlaying) return <div className="card"><p>ゲームが開始されました。カードを作成できません。</p></div>;

  return (
    <div className="card-creation-form card">
      <h3>ビンゴカードを作成</h3>
      <p>各マスにタイトルと動画ID(smXXXXXXXX または YouTubeのID)を入力してください。</p>
      <div className="bingo-input-grid">
        {Array.from({ length: 25 }).map((_, index) => {
          if (index === 12) return <div key={index} className="bingo-input-cell free">FREE</div>;
          
          const entryIndex = index < 12 ? index : index - 1;
          return (
            <div key={index} className="bingo-input-cell">
              <input
                type="text"
                value={videoEntries[entryIndex].title}
                onChange={(e) => handleInputChange(entryIndex, 'title', e.target.value)}
                placeholder="タイトル"
                className="title-input"
              />
              <input
                type="text"
                value={videoEntries[entryIndex].id}
                onChange={(e) => handleInputChange(entryIndex, 'id', e.target.value)}
                placeholder="動画ID"
                className="id-input"
              />
            </div>
          );
        })}
      </div>
      <button onClick={handleCreateCard} disabled={isLoading}>
        {isLoading ? '作成中...' : 'カードを作成'}
      </button>
    </div>
  );
};

export default BingoCard;
