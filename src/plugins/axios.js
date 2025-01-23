import axios from 'axios';

const xxx = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

console.log('Base URL:', import.meta.env.VITE_API_URL);


export default xxx;