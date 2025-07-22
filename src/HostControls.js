import React, { useState } from 'react';
import { db } from './firebase';
import { ref, update, set } from 'firebase/database';

const HostControls = ({ project, projectId }) => {
  const [calledVideoId, setCalledVideoId] = useState('');

  const handleStartGame = () => {
    if (window.confirm('ゲームを開始しますか？参加者はカードを編集できなくなります。')) {
      const projectRef = ref(db, `projects/${projectId}`);
      update(projectRef, { status: 'playing' });
    }
  };

  const handleCallVideo = () => {
    const videoId = calledVideoId.trim();
    if (!videoId) {
      alert('呼び出す動画のIDを入力してください。');
      return;
    }
    // Check for duplicates
    const isAlreadyCalled = Object.values(project.calledVideos || {}).some(v => v.id === videoId);
    if (isAlreadyCalled) {
      alert('この動画はすでにコールされています。');
      return;
    }
    const calledVideoRef = ref(db, `projects/${projectId}/calledVideos/${videoId}`);
    set(calledVideoRef, {
        id: videoId,
        timestamp: Date.now()
    });
    setCalledVideoId('');
  };

  const handleEndGame = () => {
    if (window.confirm('ゲームを終了しますか？')) {
      const projectRef = ref(db, `projects/${projectId}`);
      update(projectRef, { status: 'finished' });
    }
  };

  return (
    <div className="card host-controls">
      <h2>主催者コントロールパネル</h2>
      {project.status === 'preparing' && (
        <button onClick={handleStartGame}>ゲームを開始</button>
      )}

      {project.status === 'playing' && (
        <>
          <div className="call-video-form">
            <input
              type="text"
              value={calledVideoId}
              onChange={(e) => setCalledVideoId(e.target.value)}
              placeholder="sm... or v=..."
            />
            <button onClick={handleCallVideo}>この動画をコール</button>
          </div>
          <hr />
          <button onClick={handleEndGame} style={{backgroundColor: '#dc3545'}}>ゲームを終了</button>
        </>
      )}

      {project.status === 'finished' && (
        <p>このゲームは終了しました。</p>
      )}

      <div className="participants-list">
        <h3>参加者一覧</h3>
        <ul>
          {project.participants && Object.keys(project.participants).map(userId => (
            <li key={userId}>
              {userId} {project.participants[userId].card ? ' (カード作成済み)' : ' (カード未作成)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HostControls;
