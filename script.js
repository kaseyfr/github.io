// 模拟数据存储
let memories = [];

document.addEventListener('DOMContentLoaded', () => {
    // 加载保存的数据
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
            memories.push({ title, tag, description, images: imageDataUrls });
            saveMemories();
            console.log('Memory saved:', { title, tag, description, imageCount: imageDataUrls.length }); // 调试信息
            alert('记忆碎片已创建！');
            showMemoryList();
        }
    }

    function showMemoryList() {
        console.log('Showing memory list, count:', memories.length); // 调试信息
        let memoryListHTML = '<h2>记忆碎片列表</h2>';
        memories.forEach((memory, index) => {
            const firstImage = memory.images[0] || 'placeholder.jpg';
            memoryListHTML += `
                <div class="memory-preview">
                    <h3>${memory.title}</h3>
                    <p>标签：${memory.tag}</p>
                    <img src="${firstImage}" alt="记忆图片" style="max-width: 100px; max-height: 100px;">
                    <button onclick="showMemoryDetails(${index})">查看详情</button>
                </div>
            `;
        });
        mainContent.innerHTML = memoryListHTML;
    }

    window.showMemoryDetails = function(index) {
        const memory = memories[index];
        mainContent.innerHTML = `
            <h2>${memory.title}</h2>
            <p>标签：${memory.tag}</p>
            <p>${memory.description}</p>
            <div id="imageGallery"></div>
        `;

        const imageGallery = document.getElementById('imageGallery');
        memory.images.forEach(imageDataUrl => {
            imageGallery.innerHTML += `<img src="${imageDataUrl}" alt="记忆图片" style="max-width: 200px; max-height: 200px; margin: 5px;">`;
        });
    }

    function loadMemories() {
        const savedMemories = localStorage.getItem('memories');
        if (savedMemories) {
            memories = JSON.parse(savedMemories);
            console.log('Memories loaded from localStorage'); // 调试信息
        } else {
            console.log('No memories found in localStorage'); // 调试信息
        }
    }

    function saveMemories() {
        localStorage.setItem('memories', JSON.stringify(memories));
        console.log('Memories saved to localStorage'); // 调试信息
    }
});