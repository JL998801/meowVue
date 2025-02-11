<template>
    <div class="container">
      <h2>會員基本資料</h2>
      <div class="profile">
        <input type="text" v-model="nickName" class="input-field" />
      </div>
      <form @submit.prevent="submitForm">
        <label>姓名</label>
        <input type="name" v-model="name" class="input-field" readonly />
        
        <label>電子郵件</label>
        <input type="email" v-model="email" class="input-field" readonly/>
    
        <label>出生日期</label>
        <input type="date" v-model="dob" class="input-field" />
        
        <label>地址</label>
        <input type="address" v-model="address" class="input-field"/>
    
        <label>手機號碼</label>
        <input type="text" v-model="phone" class="input-field" />
        
        <label>LINE NOTIFY 兌換提醒通知</label>
        <select v-model="notifyExchange">
          <option>啟用</option>
          <option>停用</option>
        </select>
    
        <label>LINE NOTIFY 活動資訊通知</label>
        <select v-model="notifyEvent" class="aa">
          <option>啟用</option>
          <option>停用</option>
        </select>
    
        <button type="submit" class="submit-btn">修改資料</button>
      </form>
      <aside>
        <SidebarMenu class="fixed-sidebar" />
      </aside>
    </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SidebarMenu from "@/components/member/SidebarMenu.vue";
import Swal from 'sweetalert2'; // 引入 SweetAlert2

const router = useRouter();
// State for storing member data
const profileImage = ref(''); 
const nickName = ref('');
const name = ref('');
const email = ref('');
const dob = ref('');
const address = ref('');
const phone = ref('');
const notifyExchange = ref('啟用');
const notifyEvent = ref('啟用');

// Fetch member data
const fetchMemberData = async () => {
  const memberId = localStorage.getItem('memberId');
  
  if (memberId) {
    try {
      const response = await fetch(`http://localhost:8080/api/members/${memberId}`);
      
      if (!response.ok) {
        throw new Error('無法載入資料');
      }
      const data = await response.json();

      if (data) {
        nickName.value = data.nickName || '未設定';
        name.value = data.name || '未設定';
        email.value = data.email || '未設定';
        phone.value = data.phone || '未設定';
        address.value = data.address || '未設定';
        dob.value = data.birthday || '1990-01-01';
        profileImage.value = data.profileImage || 'defaultProfilePic.jpg';
        notifyExchange.value = data.notifyExchange || '啟用';
        notifyEvent.value = data.notifyEvent || '啟用';
      } else {
        console.error('資料載入失敗');
      }
    } catch (error) {
      console.error('發生錯誤:', error);
      alert('資料載入失敗，請稍後再試');
    }
  } else {
    console.log('未找到 memberId');
  }
};

// On component mount, fetch member data
onMounted(() => {
  fetchMemberData();
});

// Function to format date for backend (yyyy-MM-dd -> yyyy-MM-dd)
const formatDateForBackend = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Submit form handler
const submitForm = async () => {
  const memberId = localStorage.getItem('memberId');

  if (!memberId) {
    alert("無效的會員 ID");
    return;
  }

  // Format the birthdate if needed
  const formattedDob = dob.value ? formatDateForBackend(dob.value) : '1990-01-01'; 

  // Prepare the updated member data
  const updatedMember = {
    nickName: nickName.value,
    name: name.value,  // Added name
    birthday: formattedDob,  
    address: address.value,
    phone: phone.value,
    email: email.value,  // Include email
    notifyExchange: notifyExchange.value,
    notifyEvent: notifyEvent.value,
  };

  console.log(updatedMember);  // Check the data being sent

  try {
    const response = await fetch(`http://localhost:8080/api/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMember),
    });

    if (response.ok) {
      // 使用 SweetAlert2 顯示成功訊息
      Swal.fire({
        icon: 'success',
        title: '資料更新成功',
        text: '您的資料已成功更新。',
      }).then((result) => {
        if (result.isConfirmed) {
          // 點擊確認後跳轉到會員中心頁面
          router.push('/pages/MemberCenter');
        }
      });
      
    } else {
      const errorData = await response.text();
      Swal.fire({
        icon: 'error',
        title: '更新失敗',
        text: `更新失敗: ${errorData}`,
      });
    }
  } catch (error) {
    console.error('發生錯誤:', error);
    Swal.fire({
      icon: 'error',
      title: '發生錯誤',
      text: '請稍後再試',
    });
  }
};
</script>

<style scoped>
  /* 基础全局样式 */
  .fixed-sidebar {
  position: fixed;
  top: 200px;
  right: 200px;
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.aa{
  margin-bottom: 25px;
}
  body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
          font-family: 'Noto Sans KR', sans-serif;
          margin-top: 50px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 400px;
        }
        h2 {
            text-align: center;
        }
        .profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
        }
        .profile-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: gray;
            margin-bottom: 10px;
        }
        .input-field, select {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f5f5f5;
        }
        .submit-btn {
        
            width: 100%;
            padding: 10px;
            border: none;
            background: #007bff;
            color: white;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }
        .submit-btn:hover {
            background: #0056b3;
        }
</style>
