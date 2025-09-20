import React, { useState } from 'react';
import AddSubEventForm from '../components/AddSubEventForm'; // パスは適切に修正してください

function SubEventFormPage() {
  const [isModalOpen, setIsModalOpen] = useState(true); // デフォルトで開く設定

  // モーダルを閉じる関数
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // onAddは仮の処理
  const handleAddEvent = (eventData) => {
    console.log("イベントが追加されました:", eventData);
    handleCloseModal(); // 追加後にモーダルを閉じる
  };

  const dummyMembers = [
    { id: 'A', name: 'A' },
    { id: 'B', name: 'B' },
    { id: 'C', name: 'C' },
    { id: 'D', name: 'D' },
  ];

  return (
    <div>
      <h1>サブイベント入力ページ</h1>
      <button onClick={() => setIsModalOpen(true)}>フォームを開く</button>

      <AddSubEventForm
        members={dummyMembers}
        onAdd={handleAddEvent}
        isOpen={isModalOpen} // isModalOpenを渡す
        onClose={handleCloseModal} // onClose関数を渡す
      />
    </div>
  );
}

export default SubEventFormPage;