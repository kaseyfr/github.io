// 模拟数据存储
let memories = [];

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDxnIjnZvy_yM_PtXMZcWNLP0EdH-16Y5w",
    authDomain: "memoryfragments-556a5.firebaseapp.com",
    projectId: "memoryfragments-556a5",
    storageBucket: "memoryfragments-556a5.appspot.com",
    messagingSenderId: "64434542773",
    appId: "1:64434542773:web:17b33527ac11c6ce7306fc",
    measurementId: "G-G6533QNGXF"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    loadMemories();
    console.log('Loaded memories:', memories); // 调试信息

    const createMemoryLink = document.getElementById('createMemoryLink');
    const viewMemoriesLink = document.getElementById('viewMemoriesLink');
    const mainContent = document.getElementById('mainContent');

    createMemoryLink.addEventListener('click', (e) => {
        e.preventDefault();
        showCreateMemoryForm();
    });

    viewMemoriesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMemoryList();
    });

    // 初始显示记忆碎片列表
    showMemoryList();

    function showCreateMemoryForm() {
        mainContent.innerHTML = `
            <h2>创建记忆碎片</h2>
            <form id="createMemoryForm">
                <input type="text" id="title" maxlength="50" placeholder="标题（最多50字符）" required>
                <input type="text" id="tag" maxlength="10" placeholder="记忆标签（最多10字符）" required>
                <textarea id="description" maxlength="500" placeholder="记忆描述（最多500字符）" required></textarea>
                <input type="file" id="images" accept="image/*" multiple>
                <div id="imagePreview"></div>
                <button type="submit">创建</button>
            </form>
        `;

        document.getElementById('createMemoryForm').addEventListener('submit', createMemory);
        document.getElementById('images').addEventListener('change', previewImages);
    }

    function previewImages(event) {
        console.log('Preview images function called'); // 调试信息
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = '';
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100px';
                    img.style.maxHeight = '100px';
                    img.style.margin = '5px';
                    imagePreview.appendChild(img);
                    console.log('Image preview added'); // 调试信息
                }
                reader.readAsDataURL(file);
            }
        }
    }

    function createMemory(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const tag = document.getElementById('tag').value;
        const description = document.getElementById('description').value;
        const images = document.getElementById('images').files;

        const imageDataUrls = [];
        let loadedImages = 0;

        if (images.length === 0) {
            saveMemory(); // 如果没有图片，直接保存
        } else {
            for (let i = 0; i < images.length; i++) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageDataUrls.push(e.target.result);
                    loadedImages++;
                    if (loadedImages === images.length) {
                        saveMemory();
                    }
                }
                reader.readAsDataURL(images[i]);
            }
        }

        function saveMemory() {
            const newMemory = { title, tag, description, images: imageDataUrls };
            saveMemories(newMemory).then((id) => {
                memories.push({...newMemory, id});
                console.log('Memory saved:', newMemory);
                showMemoryList();
                alert('记忆碎片创建成功！');
            }).catch((error) => {
                console.error("Error saving memory: ", error);
                alert('保存记忆碎片时出错，请重试��');
            });
        }
    }

    function showMemoryList() {
        console.log('Showing memory list, count:', memories.length);
        let memoryListHTML = '<h2>记忆碎片列表</h2>';
        memories.forEach((memory) => {
            const firstImage = memory.images[0] || 'placeholder.jpg';
            memoryListHTML += `
                <div class="memory-preview">
                    <h3>${memory.title}</h3>
                    <p>标签：${memory.tag}</p>
                    <img src="${firstImage}" alt="记忆图片" style="max-width: 100px; max-height: 100px;">
                    <button onclick="showMemoryDetails('${memory.id}')">查看详情</button>
                </div>
            `;
        });
        mainContent.innerHTML = memoryListHTML;
    }

    window.showMemoryDetails = function(id) {
        const memory = memories.find(m => m.id === id);
        if (!memory) {
            console.error('Memory not found:', id);
            return;
        }
        mainContent.innerHTML = `
            <h2>${memory.title}</h2>
            <p>标签：${memory.tag}</p>
            <p>${memory.description}</p>
            <div id="imageGallery"></div>
            <button onclick="showMemoryList()">返回列表</button>
        `;

        const imageGallery = document.getElementById('imageGallery');
        memory.images.forEach(imageDataUrl => {
            imageGallery.innerHTML += `<img src="${imageDataUrl}" alt="记忆图片" style="max-width: 200px; max-height: 200px; margin: 5px;">`;
        });
    }

    function loadMemories() {
        db.collection("memories").get().then((querySnapshot) => {
            memories = [];
            querySnapshot.forEach((doc) => {
                memories.push({...doc.data(), id: doc.id});
            });
            console.log('Memories loaded from Firestore:', memories);
            showMemoryList();
        }).catch((error) => {
            console.error("Error loading memories: ", error);
        });
    }

    function saveMemories(newMemory) {
        return db.collection("memories").add(newMemory)
            .then((docRef) => {
                console.log("Memory saved with ID: ", docRef.id);
                return docRef.id;
            })
            .catch((error) => {
                console.error("Error adding memory: ", error);
                throw error;
            });
    }
});