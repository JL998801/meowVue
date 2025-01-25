<template>
    <div>
      <div class="sidebar">
        <h2>商城後台管理系统</h2>
        <a href="2" class="active">用戶管理</a>
        <a href="3">分類管理</a>
        <a href="4">訂單管理</a>
        <a href="5">商品管理</a>
        <a href="6">評論管理</a>
        <a href="7">運營管理</a>
        <a href="8">日誌管理</a>
        <a href="9">系统信息</a>
      </div>
  
      <div class="main-content">
        <div class="header">
          <div class="title">用戶管理</div>
          <div class="member-info">
            <a href="/ajax/secure/login">登出</a>
          </div>
        </div>
  
        <button @click="fetchmembers">更新</button>
        <button @click="addMember">新增</button>
        <input type="text" v-model="searchQuery" placeholder="用户名">
        <button @click="searchmembers">搜尋</button>
  
        <table>
          <thead>
            <tr>
              <th>序號</th>
              <th>帳號</th>
              <th>名稱</th>
              <th>更新日期</th>
              <th>地址</th>
              <th>手機</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
  <tr v-for="(member, index) in members" :key="member.memberId">
    <td>{{ index + 1 }}</td>
    <td>{{ member.email }}</td>
    <td>{{ member.nickName }}</td>
    <td>{{ member.updateDate }}</td>
    <td>{{ member.address }}</td>
    <td>{{ member.phone }}</td>
    <td>
      <button @click="editMember(member.memberId)">编辑</button>
      <button @click="deleteMember(member.memberId)">删除</button>
    </td>
  </tr>
</tbody>
        </table>
  
        <ul class="pagination">
          <li><a href="13">1</a></li>
          <li><a href="14">2</a></li>
          <li><a href="15">3</a></li>
          <li><a href="16">4</a></li>
          <li><a href="17">5</a></li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import xxx from '@/plugins/axios.js';
  import Swal from 'sweetalert2';
 

export default {
  name: "memberManagement",
  data() {
    return {
      members: [],  // 存儲會員資料
      searchQuery: '',  // 搜索關鍵字
    };
  },
  methods: {
    // 獲取所有會員資料
    async fetchmembers() {
  try {
    const response = await xxx.get('/api/members');
    console.log("Fetched members:", response.data); // 確認資料結構
    this.members = response.data; // 設定 Vue 的 members 陣列
  } catch (error) {
    console.error("Error fetching members:", error); // 捕獲並顯示錯誤
  }
},
    // 根據搜尋關鍵字過濾會員資料
    async searchmembers() {
      if (this.searchQuery) {
        try {
          // 發送帶有搜尋參數的請求
          const response = await xxx.get('/api/members', {
            params: { search: this.searchQuery }
          });
          this.members = response.data;
        } catch (error) {
          console.error("Error searching members:", error);
        }
      } else {
        this.fetchmembers();  // 沒有搜尋關鍵字時，重新獲取所有資料
      }
    },

    // 新增會員
    async addMember(newMemberData) {
  console.log('Adding new member with data:', newMemberData);
  if (!newMemberData || !newMemberData.name || !newMemberData.email) {
    Swal.fire('錯誤', '請填寫完整的會員資料', 'error');
    return;
  }
  try {
    const result = await Swal.fire({
      title: '確認新增會員？',
      text: '請確認新增此會員資料。',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，新增！',
      cancelButtonText: '取消'
    });
    if (result.isConfirmed) {
      await xxx.post('/api/members', newMemberData); // 發送到後端的 API
      Swal.fire('新增成功！', '會員已成功新增。', 'success');
      this.fetchmembers(); // 重新載入列表
    }
  } catch (error) {
    console.error('Error adding member:', error);
    Swal.fire('新增失敗', '請稍後再試。', 'error');
  }
}
,
  // 刪除會員
  async deleteMember(memberId) {
  console.log('Deleting member with ID:', memberId); // 確認 memberId 是否正確
  if (!memberId) {
    Swal.fire('錯誤', '會員 ID 無效', 'error');
    return;
  }
  try {
    const result = await Swal.fire({
      title: '您確定要刪除此會員嗎？',
      text: '此操作將永久刪除此會員！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，刪除！',
      cancelButtonText: '取消'
    });
    if (result.isConfirmed) {
      await xxx.delete(`/api/members/${memberId}`);
      Swal.fire('刪除成功！', '會員已被刪除。', 'success');
      this.fetchmembers(); // 重新獲取會員列表
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    Swal.fire('刪除失敗', '請稍後再試。', 'error');
  }
}
,
        // 編輯會員
        async editMember(memberId) {
    try {
    // 確保傳入的 memberId 是有效的
    if (!memberId) {
      console.error("Invalid member ID:", memberId);
      Swal.fire('錯誤', '會員 ID 無效', 'error');
      return;
    }
    // 使用 Vue Router 導航到編輯頁面，並將 memberId 傳遞到路由
    this.$router.push({ path: `/edit-member/${memberId}` });
  } catch (error) {
    console.error("Error editing member:", error);
  }
}
,
  },
  mounted() {
    // 頁面加載時自動獲取會員資料
    this.fetchmembers();
  }
};
</script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  
  .sidebar {
    width: 240px;
    background-color: #0d2741;
    color: #fff;
    position: fixed;
    height: 100%;
    padding: 20px 10px;
  }
  
  .sidebar h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .sidebar a {
    display: block;
    color: #fff;
    text-decoration: none;
    margin: 10px 0;
    padding: 10px;
    border-radius: 4px;
  }
  
  .sidebar a:hover {
    background-color: #1a456a;
  }
  
  .main-content {
    margin-left: 240px;
    padding: 20px;
  }
  
  .main-content .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header .title {
    font-size: 24px;
    font-weight: bold;
  }
  
  .header .member-info {
    font-size: 14px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  th,
  td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f8f8f8;
  }
  
  .pagination {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
  }
  
  .pagination li {
    margin: 0 5px;
  }
  
  .pagination a {
    text-decoration: none;
    color: #007bff;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .pagination a:hover {
    background-color: #007bff;
    color: #fff;
  }
  </style>
  