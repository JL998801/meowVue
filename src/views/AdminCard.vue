<template>
  <div class="aa">
    <div class="main-content">
      <div class="header">
        <div class="title">用戶管理</div>
        <div class="member-info" style="display: flex; align-items: center;">
          <h6>管理員[admin]</h6>
          <a href="/" style="margin-right: 10px;">登出</a>
        </div>
      </div>
      <div class="bb">
        <button @click="fetchmembers">更新</button>
        <button @click="showAddMemberModal">新增</button>
        <input type="text" v-model="searchQuery" placeholder="用户名">
        <button @click="searchmembers">搜尋</button>
      </div>
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
          <tr v-for="(member, index) in paginatedMembers" :key="member.memberId">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.nickName }}</td>
            <td>{{ member.createDate }}</td>
            <td>{{ member.address }}</td>
            <td>{{ member.phone }}</td>
            <td>
              <button @click="editMember(member.memberId)">编辑</button>
              <button @click="deleteMember(member.memberId)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分頁控制 -->
      <ul class="pagination">
        <li @click="goToPage(1)" :class="{ disabled: currentPage === 1 }"><a href="javascript:void(0)">1</a></li>
        <li @click="goToPage(2)" :class="{ disabled: currentPage === 2 }"><a href="javascript:void(0)">2</a></li>
        <li @click="goToPage(3)" :class="{ disabled: currentPage === 3 }"><a href="javascript:void(0)">3</a></li>
        <li @click="goToPage(4)" :class="{ disabled: currentPage === 4 }"><a href="javascript:void(0)">4</a></li>
        <li @click="goToPage(5)" :class="{ disabled: currentPage === 5 }"><a href="javascript:void(0)">5</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { axiosapi } from '@/plugins/axios';
import { useRoute } from "vue-router";

const baseUrl = import.meta.env.VITE_API_URL;
const members = ref([]);  // 存儲會員資料
const searchQuery = ref('');  // 搜索關鍵字
const currentPage = ref(1);  // 當前頁碼
const pageSize = ref(8);  // 每頁顯示數量

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return members.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(members.value.length / pageSize.value);
});

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 設定axios的基本URL
const axiosInstance = axiosapi.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// 獲取所有會員資料
const fetchmembers = async () => {
  try {
    const response = await axiosInstance.get('/members');
    console.log("Fetched members:", response.data); // 確認資料結構
    members.value = response.data; // 設定 Vue 的 members 陣列
  } catch (error) {
    console.error("Error fetching members:", error); // 捕獲並顯示錯誤
  }
};

// 編輯會員
const editMember = async (memberId) => {
  try {
    if (!memberId) {
      console.error("Invalid member ID:", memberId);
      Swal.fire('錯誤', '會員 ID 無效', 'error');
      return;
    }

    const response = await axiosInstance.get(`/members/${memberId}`); 
    const member = response.data;

    const { value: editedMemberData, isConfirmed } = await Swal.fire({
      title: '編輯會員',
      html: `
        <input id="email" class="swal2-input" placeholder="電子郵件" type="email" value="${member.email}">
        <input id="nickName" class="swal2-input" placeholder="使用者暱稱" type="text" value="${member.nickName}">
        <input id="phone" class="swal2-input" placeholder="手機號碼" type="text" value="${member.phone}">
        <input id="birthday" class="swal2-input" placeholder="生日" type="date" value="${member.birthday}">
        <input id="address" class="swal2-input" placeholder="地址" type="text" value="${member.address}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: '取消',
      confirmButtonText: '確認修改',
      preConfirm: () => {
        return {
          email: document.getElementById('email').value,
          nickName: document.getElementById('nickName').value,
          phone: document.getElementById('phone').value,
          birthday: document.getElementById('birthday').value,
          address: document.getElementById('address').value
        };
      }
    });

    if (isConfirmed && editedMemberData) {
      updateMember(memberId, editedMemberData);
    }
  } catch (error) {
    console.error("Error editing member:", error);
    Swal.fire('錯誤', '無法獲取會員資料', 'error');
  }
};

// 更新會員資料
const updateMember = async (memberId, updatedData) => {
  try {
    const memberData = {
      email: updatedData.email,
      nickName: updatedData.nickName,
      name: updatedData.fullName, // 使用 fullName 來對應資料
      phone: updatedData.phone,
      birthday: updatedData.birthday,
      address: updatedData.address
    };

    const response = await axiosInstance.put(`/members/${memberId}`, memberData);

    Swal.fire('修改成功！', '會員資料已成功更新。', 'success');
    fetchmembers(); // 重新載入會員列表
  } catch (error) {
    console.error('Error updating member:', error);
    Swal.fire('修改失敗', '請稍後再試。', 'error');
  }
};

// 根據搜尋關鍵字過濾會員資料
// 根據搜尋關鍵字過濾會員資料
const searchmembers = async () => {
  if (searchQuery.value) {
    // 重設頁碼為第一頁
    currentPage.value = 1;

    try {
      const response = await axiosInstance.get('/members', {
        params: { search: searchQuery.value }
      });
      members.value = response.data;
    } catch (error) {
      console.error("Error searching members:", error);
    }
  } else {
    fetchmembers();  // 沒有搜尋關鍵字時，重新獲取所有資料
  }
};


// 顯示新增會員的 SweetAlert2 表單
const showAddMemberModal = async () => {
  const { value: newMemberData, isConfirmed } = await Swal.fire({
    title: '新增會員',
    html: `
      <input id="email" class="swal2-input" placeholder="電子郵件" type="email">
      <input id="nickName" class="swal2-input" placeholder="使用者暱稱" type="text">
      <input id="password" class="swal2-input" placeholder="密碼" type="password">
      <input id="fullName" class="swal2-input" placeholder="姓名" type="text">
      <input id="phone" class="swal2-input" placeholder="手機號碼" type="text">
      <input id="birthday" class="swal2-input" placeholder="生日" type="date">
      <input id="address" class="swal2-input" placeholder="地址" type="text">
    `,
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonText: '確認新增',
    preConfirm: () => {
      return {
        email: document.getElementById('email').value,
        nickName: document.getElementById('nickName').value,
        password: document.getElementById('password').value,
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        birthday: document.getElementById('birthday').value,
        address: document.getElementById('address').value
      };
    }
  });

  if (isConfirmed && newMemberData) {
    addMember(newMemberData);
  }
};

// 新增會員
const addMember = async (newMemberData) => {
  if (!newMemberData || !newMemberData.nickName || !newMemberData.email || !newMemberData.password) {
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
      const memberData = {
        nickName: newMemberData.nickName,
        password: newMemberData.password,
        name: newMemberData.fullName,
        email: newMemberData.email,
        phone: newMemberData.phone,
        address: newMemberData.address,
        birthday: newMemberData.birthday
      };

      const response = await axiosInstance.post(`/members`, memberData);

      Swal.fire('新增成功！', '會員已成功新增。', 'success');
      fetchmembers(); // 重新載入會員列表
    }
  } catch (error) {
    console.error('Error adding member:', error);
    Swal.fire('新增失敗', '請稍後再試。', 'error');
  }
};

// 刪除會員
const deleteMember = async (memberId) => {
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
      await axiosInstance.delete(`/members/${memberId}`);
      Swal.fire('刪除成功！', '會員已被刪除。', 'success');
      fetchmembers(); // 重新獲取會員列表
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    Swal.fire('刪除失敗', '請稍後再試。', 'error');
  }
};

onMounted(() => {
  fetchmembers();
});

defineOptions({
  name: 'AdminCard',
});
</script>

  
  <style scoped>
  
  
.aa{
    
    margin-right: 200px;
}

  body {
    
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  
  
  
  .sidebar h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }

  
  .main-content {
    display: flex;
    margin-left: 240px;
    padding: 20px;
  }
  
  .main-content .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .head{
   
    margin-left: 300px;
  }
  .header .title {
    display: flex;
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