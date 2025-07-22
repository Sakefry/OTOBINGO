import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, push, onValue, set, update } from 'firebase/database';
import BingoCard from './BingoCard';
import HostControls from './HostControls';
import WinnersDisplay from './WinnersDisplay'; // WinnersDisplay をインポート
import './App.css';

function App() {
  const [projects, setProjects] = useState({});
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [userId, setUserId] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // Firebaseからプロジェクト一覧を読み込む
  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      setProjects(data || {});
    });
  }, []);

  // ユーザー名を決定する
  const handleSetUser = () => {
    if (usernameInput.trim()) {
      setUserId(usernameInput.trim());
    }
  };

  // 新しいプロジェクトを作成する
  const handleCreateProject = () => {
    if (newProjectTitle.trim() === '' || !userId) {
      alert('タイトルを入力してください。');
      return;
    }
    const projectsRef = ref(db, 'projects');
    const newProjectRef = push(projectsRef);
    const newProjectKey = newProjectRef.key;
    set(newProjectRef, {
      title: newProjectTitle,
      hostId: userId,
      createdAt: Date.now(),
      status: 'preparing',
      calledVideos: {},
      participants: {
        [userId]: { name: userId }
      }
    });
    setNewProjectTitle('');
    setCurrentProjectId(newProjectKey);
  };

  // プロジェクトに参加する
  const handleSelectProject = (projectId) => {
    const participantRef = ref(db, `projects/${projectId}/participants/${userId}`);
    update(participantRef, { name: userId });
    setCurrentProjectId(projectId);
  };

  // メインコンテンツのレンダリング
  const renderContent = () => {
    // 1. ユーザー名がまだ設定されていない場合
    if (!userId) {
      return (
        <div className="card">
          <h2>ようこそ！</h2>
          <p>まず、あなたの名前を入力してください。</p>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="あなたの名前"
          />
          <button onClick={handleSetUser}>決定</button>
        </div>
      );
    }

    // 2. プロジェクトが選択されていない場合
    if (!currentProjectId) {
      return (
        <div className="project-selection">
          <h1>オンラインビンゴ</h1>
          <p>ようこそ, {userId} さん！</p>
          <div className="card">
            <h2>新しいビンゴを作成</h2>
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="ビンゴのタイトル"
            />
            <button onClick={handleCreateProject}>作成</button>
          </div>
          <div className="card">
            <h2>参加するビンゴを選択</h2>
            <ul>
              {Object.keys(projects).map((projectId) => (
                <li key={projectId}>
                  <button onClick={() => handleSelectProject(projectId)}>
                    {projects[projectId].title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // 3. プロジェクトが選択されている場合 (ゲーム画面)
    const project = projects[currentProjectId];
    if (!project) return <div>Loading project...</div>;
    const isHost = project.hostId === userId;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{project.title}</h2>
          <button onClick={() => setCurrentProjectId(null)}>プロジェクト選択に戻る</button>
        </div>
        <p>参加者: {userId} {isHost && '(主催者)'}</p>
        
        <WinnersDisplay project={project} />

        {isHost && <HostControls projectId={currentProjectId} project={project} />}
        
        <BingoCard projectId={currentProjectId} userId={userId} project={project} />
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {renderContent()}
      </header>
    </div>
  );
}

export default App;
