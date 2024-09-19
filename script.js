// 模拟数据存储
let memories = [];

document.addEventListener('DOMContentLoaded', () => {
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
                <input type="text" id="tag" maxlength="10" placeholder="记忆标签��最多10字符）" required>
                <textarea id="description" maxlength="500" placeholder="记忆描述（最多500字符）" required></textarea>
                <input type="file" id="images" accept="image/*" multiple>
                <button type="submit">创建</button>
            </form>
        `;

        document.getElementById('createMemoryForm').addEventListener('submit', createMemory);
    }

    function createMemory(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const tag = document.getElementById('tag').value;
        const description = document.getElementById('description').value;
        const images = document.getElementById('images').files;

        // 这里应该添加图片上传逻辑，现在我们只是存储文件名
        const imageNames = Array.from(images).map(file => file.name);

        memories.push({ title, tag, description, images: imageNames });
        alert('记忆碎片已创建！');
        showMemoryList();
    }

    function showMemoryList() {
        let memoryListHTML = '<h2>记忆碎片列表</h2>';
        memories.forEach((memory, index) => {
            memoryListHTML += `
                <div class="memory-preview">
                    <h3>${memory.title}</h3>
                    <p>标签：${memory.tag}</p>
                    <img src="placeholder.jpg" alt="记忆图片">
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
        memory.images.forEach(imageName => {
            imageGallery.innerHTML += `<img src="placeholder.jpg" alt="${imageName}">`;
        });
    }
});