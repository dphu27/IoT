// Giả lập dữ liệu theo giờ (có thể thay thế bằng dữ liệu thực tế từ cơ sở dữ liệu)
const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

// Dữ liệu nhiệt độ, độ ẩm, ánh sáng và khí gas giả lập
const temperatureData = [22, 23, 24, 24, 25, 25, 26, 27, 26, 24, 23, 22, 22, 23, 24, 24, 25, 25, 26, 27, 26, 24, 23, 20];
const humidityData = [30, 35, 40, 45, 50, 55, 60, 55, 50, 45, 40, 35, 30, 35, 40, 45, 50, 55, 60, 55, 50, 45, 40, 25];
const lightData = [200, 220, 240, 260, 280, 300, 320, 310, 300, 280, 260, 240, 200, 220, 240, 260, 280, 300, 320, 310, 300, 280, 260, 240];
// const gasData = [50, 52, 54, 53, 52, 55, 60, 58, 55, 53, 52, 51, 50, 52, 54, 53, 52, 55, 60, 58, 55, 53, 52, 51];

// Hàm cập nhật các hộp thống kê
function updateStats() {
    const lastTemp = temperatureData[temperatureData.length - 1];
    const lastHumidity = humidityData[humidityData.length - 1];
    const lastLight = lightData[lightData.length - 1];
    const lastGas = gasData[gasData.length - 1];

    document.querySelector('.stat-box:nth-child(1) h3').textContent = `${lastTemp}°C`;
    document.querySelector('.stat-box:nth-child(2) h3').textContent = `${lastHumidity}%`;
    document.querySelector('.stat-box:nth-child(3) h3').textContent = `${lastLight}`;
    document.querySelector('.stat-box:nth-child(4) h3').textContent = `${lastGas}`;
}

// chuyển trang

function showPage(page) {
    // Ẩn tất cả các trang
    const pages = document.querySelectorAll('.page');
    pages.forEach((pageElement) => {
        pageElement.style.display = 'none';
    });

    // Hiển thị trang được chọn
    const selectedPage = document.getElementById(page + 'Page');
    selectedPage.style.display = 'block';

    // Xóa lớp 'active' khỏi tất cả các tab
    const tabs = document.querySelectorAll('.sidebar ul li');
    tabs.forEach((tab) => {
        tab.classList.remove('active');
    });

    // Thêm lớp 'active' vào tab được chọn
    const selectedTab = document.getElementById(page + 'Tab');
    selectedTab.classList.add('active');
}

// Hiển thị trang Dashboard khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    showPage('dashboard');
});

// Tạo biểu đồ theo dõi môi trường theo giờ
const ctxEnvironmentHourly = document.getElementById('environmentHourlyChart').getContext('2d');
const environmentHourlyChart = new Chart(ctxEnvironmentHourly, {
    type: 'line',
    data: {
        labels: hours,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: 'Humidity (%)',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            },
            {
                label: 'Light (Lux)',
                data: lightData,
                borderColor: 'rgba(255, 206, 86, 1)',
                fill: false,
            },
            // {
            //     label: 'Gas (ppm)',
            //     data: gasData,
            //     borderColor: 'rgba(75, 192, 192, 1)',
            //     fill: false,
            // }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Lưu lịch sử vào localStorage
// scripts.js

let historyId = 0; // Biến đếm ID cho bảng lịch sử

function saveHistory(deviceName, status) {
    const currentTime = new Date().toLocaleString(); // Lấy thời gian hiện tại
    historyId++; // Tăng ID cho mỗi mục nhập
    localStorage.setItem('historyId', historyId); // Lưu trữ giá trị mới của historyId vào localStorage

    const newEntry = {
        id: historyId,
        deviceName: deviceName,
        status: status,
        time: currentTime
    };

    // Lấy lịch sử hiện tại từ localStorage
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(newEntry);
    localStorage.setItem('history', JSON.stringify(history));

    // Cập nhật bảng lịch sử
    updateHistoryTable();
}


const rowsPerPage = 5; // Số lượng hàng hiển thị trên mỗi trang
let currentPage = 1; // Trang hiện tại

function updateHistoryTable() {
    const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
    historyTable.innerHTML = ''; // Xóa tất cả các hàng hiện có

    // Lấy lịch sử từ localStorage
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // Tính toán số lượng trang
    const totalPages = Math.ceil(history.length / rowsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = history.slice(startIndex, endIndex);

    // Thêm dữ liệu vào bảng
    pageData.forEach(entry => {
        const newRow = historyTable.insertRow();
        newRow.insertCell(0).textContent = entry.id;
        newRow.insertCell(1).textContent = entry.deviceName;
        newRow.insertCell(2).textContent = entry.status;
        newRow.insertCell(3).textContent = entry.time;

        // Thêm nút xóa
        // const deleteCell = newRow.insertCell(4);
        // const deleteButton = document.createElement('button');
        // deleteButton.textContent = 'Xóa';
        // deleteButton.className = 'delete-button';
        // deleteButton.addEventListener('click', () => deleteHistoryEntry(entry.id));
        // deleteCell.appendChild(deleteButton);
    });

    // Cập nhật nút phân trang
    updatePagination(totalPages);
}

// Xóa mục lịch sử dựa trên ID
function deleteHistoryEntry(id) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('history', JSON.stringify(history));

    // Cập nhật bảng lịch sử
    updateHistoryTable();
}

// Xóa toàn bộ lịch sử
function deleteAllHistory() {
    localStorage.removeItem('history');
    updateHistoryTable();
}

// Thêm nút xóa toàn bộ lịch sử vào HTML
document.addEventListener('DOMContentLoaded', () => {
    const deleteAllButton = document.getElementById('deleteAllButton');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', deleteAllHistory);
    }
});

// Tìm kiếm trong bảng
function searchTable() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toLowerCase();
    let table = document.getElementById('historyTable');
    let tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        let tdArray = tr[i].getElementsByTagName('td');
        let match = false;
        for (let j = 0; j < tdArray.length; j++) {
            let td = tdArray[j];
            if (td) {
                if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                    match = true;
                    break;
                }
            }
        }
        tr[i].style.display = match ? "" : "none";
    }
}

// Sắp xếp bảng
function sortTable(columnIndex) {
    let table = document.getElementById("historyTable");
    let rows = Array.from(table.rows).slice(1);
    let isAscending = table.getAttribute("data-sort-dir") === "asc";
    
    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText.toLowerCase();
        let cellB = rowB.cells[columnIndex].innerText.toLowerCase();

        if (!isNaN(cellA) && !isNaN(cellB)) {
            // Sắp xếp số
            return isAscending ? cellA - cellB : cellB - cellA;
        } else {
            // Sắp xếp chữ
            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });

    table.tBodies[0].append(...rows);
    table.setAttribute("data-sort-dir", isAscending ? "desc" : "asc");
}


function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Xóa các nút phân trang hiện có

    const maxVisiblePages = 3; // Số lượng trang liền kề hiển thị tối đa
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Thêm nút "Trước"
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Trước';
        prevButton.addEventListener('click', () => {
            currentPage--;
            updateHistoryTable();
        });
        paginationContainer.appendChild(prevButton);
    }

    // Hiển thị trang đầu nếu currentPage > 2
    if (currentPage > halfVisible + 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => {
            currentPage = 1;
            updateHistoryTable();
        });
        paginationContainer.appendChild(firstButton);

        if (currentPage > halfVisible + 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    // Hiển thị các trang liền kề xung quanh trang hiện tại
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active-page'); // Đánh dấu trang hiện tại
        }
        button.addEventListener('click', () => {
            currentPage = i;
            updateHistoryTable();
        });
        paginationContainer.appendChild(button);
    }

    // Hiển thị trang cuối nếu currentPage < totalPages - 2
    if (currentPage < totalPages - halfVisible) {
        if (currentPage < totalPages - halfVisible - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }

        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            updateHistoryTable();
        });
        paginationContainer.appendChild(lastButton);
    }

    // Thêm nút "Tiếp theo"
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Tiếp theo';
        nextButton.addEventListener('click', () => {
            currentPage++;
            updateHistoryTable();
        });
        paginationContainer.appendChild(nextButton);
    }
}


// Gọi hàm để cập nhật bảng lịch sử khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    // Hiển thị bảng lịch sử
    updateHistoryTable();
});

function searchHistory() {
    // Lấy giá trị từ thanh tìm kiếm
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('historyTable');
    const rows = table.getElementsByTagName('tr');
    
    // Bắt đầu từ hàng thứ 1 (bỏ qua tiêu đề)
    for (let i = 1; i < rows.length; i++) {
        const id = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        const name = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
        const status = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
        const time = rows[i].getElementsByTagName('td')[3].textContent.toLowerCase();
        
        // Kiểm tra xem hàng có khớp với giá trị tìm kiếm không
        if (id.includes(searchInput) || name.includes(searchInput) || status.includes(searchInput) || time.includes(searchInput)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}


function toggleDevice(deviceName, element) {
    const status = element.checked ? 'On' : 'Off';
    saveHistory(deviceName, status);
    
    // Lưu trạng thái vào localStorage
    localStorage.setItem(`${deviceName}State`, element.checked);
}


// Gán sự kiện cho các công tắc thiết bị
document.addEventListener('DOMContentLoaded', () => {
    showPage('dashboard');

    const fanSwitch = document.querySelector('#fanImage + .switch input');
    fanSwitch.addEventListener('change', function() {
        toggleDevice('Fan', this);
    });

    const acSwitch = document.querySelector('#acImage + .switch input');
    acSwitch.addEventListener('change', function() {
        toggleDevice('AC', this);
    });

    const lightSwitch = document.querySelector('#lightImage + .switch input');
    lightSwitch.addEventListener('change', function() {
        toggleDevice('Light', this);
    });
});

 // Hàm để cập nhật trạng thái thiết bị và lưu lịch sử
 function updateDevice(device, isChecked, imageElement, onImageSrc, offImageSrc) {
    if (isChecked) {
        imageElement.src = onImageSrc;
    } else {
        imageElement.src = offImageSrc;
    }
    // Lưu trạng thái vào localStorage
    localStorage.setItem(`${device}State`, isChecked);
}

// Hàm để khôi phục trạng thái của các công tắc từ localStorage
function restoreState() {
    const fanState = localStorage.getItem('FanState') === 'true';
    const acState = localStorage.getItem('ACState') === 'true';
    const lightState = localStorage.getItem('LightState') === 'true';

    const fanCheckbox = document.querySelector('#fanImage + .switch input');
    const acCheckbox = document.querySelector('#acImage + .switch input');
    const lightCheckbox = document.querySelector('#lightImage + .switch input');

    fanCheckbox.checked = fanState;
    acCheckbox.checked = acState;
    lightCheckbox.checked = lightState;

    const fanImage = document.getElementById('fanImage');
    const acImage = document.getElementById('acImage');
    const lightImage = document.getElementById('lightImage');

    fanImage.src = fanState ? 'images/fanon.gif' : 'images/fanoff.png';
    acImage.src = acState ? 'images/acon.gif' : 'images/acoff.png';
    lightImage.src = lightState ? 'images/light-on-unscreen.gif' : 'images/light-off.png';
}


// Khôi phục trạng thái khi tải trang
restoreState();

document.addEventListener('DOMContentLoaded', function () {
    
    const fanSwitch = document.querySelector('.control-box:nth-child(1) input[type="checkbox"]');
    const acSwitch = document.querySelector('.control-box:nth-child(2) input[type="checkbox"]');
    const lightSwitch = document.querySelector('.control-box:nth-child(3) input[type="checkbox"]');

    

    // Sự kiện thay đổi của công tắc quạt
    fanSwitch.addEventListener('change', function () {
        updateDevice('Fan', fanSwitch.checked, fanImage, 'images/fanon.gif', 'images/fanoff.png');
    });

    // Sự kiện thay đổi của công tắc điều hòa
    acSwitch.addEventListener('change', function () {
        updateDevice('AC', acSwitch.checked, acImage, 'images/acon.gif', 'images/acoff.png');
    });

    // Sự kiện thay đổi của công tắc đèn
    lightSwitch.addEventListener('change', function () {
        updateDevice('Light', lightSwitch.checked, lightImage, 'images/light-on-unscreen.gif', 'images/light-off.png');
    });

    // Tải trạng thái từ lịch sử (nếu cần)
    function loadState() {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        if (history.length > 0) {
            let latestFan = history.reverse().find(item => item.device === 'Fan');
            let latestAC = history.find(item => item.device === 'AC');
            let latestLight = history.find(item => item.device === 'Light');

            if (latestFan) {
                fanSwitch.checked = latestFan.state === 'ON';
                updateDevice('Fan', fanSwitch.checked, fanImage, 'images/fanon-unscreen.gif', 'images/fanoff.png');
            }
            if (latestAC) {
                acSwitch.checked = latestAC.state === 'ON';
                updateDevice('AC', acSwitch.checked, acImage, 'images/acon-unscreen.gif', 'images/acoff.png');
            }
            if (latestLight) {
                lightSwitch.checked = latestLight.state === 'ON';
                updateDevice('Light', lightSwitch.checked, lightImage, 'images/light-on-unscreen.png', 'images/light-off.png');
            }
        }
    }

    // Gọi hàm loadState khi tải lại trang
    loadState();

    // thay đoi mau theo gt
    // Lấy các hộp
    const temperatureBox = document.getElementById('temperatureBox');
    const humidityBox = document.getElementById('humidityBox');
    const lightBox = document.getElementById('lightBox');
    const gasBox = document.getElementById('gasBox');

    // Hàm để đổi màu dựa trên giá trị
    function updateBoxColor(box, value, thresholds, colors) {
        let color = colors[0]; // Màu mặc định
        for (let i = 0; i < thresholds.length; i++) {
            if (value > thresholds[i]) {
                color = colors[i + 1];
            } else {
                break;
            }
        }
        box.style.backgroundColor = color;
    }

    setInterval(function() {
        // Giả sử đây là dữ liệu mới bạn nhận được
        const newData = {
            temperature: Math.floor(Math.random() * 10) + 20,
            humidity: Math.floor(Math.random() * 20) + 40,
            light: Math.floor(Math.random() * 100) + 200,
        };
    
        // Cập nhật giá trị trong các hộp
        document.getElementById('temperatureBox').querySelector('h3').textContent = newData.temperature + '°C';
        document.getElementById('humidityBox').querySelector('h3').textContent = newData.humidity + '%';
        document.getElementById('lightBox').querySelector('h3').textContent = newData.light + ' lux';
    
        // Cập nhật dữ liệu biểu đồ
        environmentHourlyChart.data.datasets[0].data.push(newData.temperature);
        environmentHourlyChart.data.datasets[1].data.push(newData.humidity);
        environmentHourlyChart.data.datasets[2].data.push(newData.light);
    
        // Loại bỏ dữ liệu cũ (nếu cần)
        if (environmentHourlyChart.data.datasets[0].data.length > 6) {
            environmentHourlyChart.data.datasets[0].data.shift();
            environmentHourlyChart.data.datasets[1].data.shift();
            environmentHourlyChart.data.datasets[2].data.shift();
        }
    
        environmentHourlyChart.update(); // Cập nhật biểu đồ
    }, 10000); // Cập nhật mỗi 5 giây
    


    // Các ngưỡng và màu tương ứng
    const temperatureThresholds = [10, 20, 30]; // Ví dụ các ngưỡng cho nhiệt độ
    const temperatureColors = ['#00bfff', '#87ceeb', '#ffa07a', '#ff4500']; // Màu từ xanh đến đỏ

    const humidityThresholds = [30, 60, 90];
    const humidityColors = ['#add8e6', '#87cefa', '#4682b4', '#00008b'];

    const lightThresholds = [100, 300, 500];
    const lightColors = ['#ffffe0', '#fffacd', '#ffd700', '#ffa500'];

    // const gasThresholds = [50, 100, 150];
    // const gasColors = ['#98fb98', '#00fa9a', '#32cd32', '#006400'];

    // Lấy giá trị từ thuộc tính data-value và cập nhật màu sắc
    updateBoxColor(temperatureBox, parseInt(temperatureBox.getAttribute('data-value')), temperatureThresholds, temperatureColors);
    updateBoxColor(humidityBox, parseInt(humidityBox.getAttribute('data-value')), humidityThresholds, humidityColors);
    updateBoxColor(lightBox, parseInt(lightBox.getAttribute('data-value')), lightThresholds, lightColors);
    updateBoxColor(gasBox, parseInt(gasBox.getAttribute('data-value')), gasThresholds, gasColors);
});

// Sensor History
let sensorHistoryData = [];
let sensorItemsPerPage = 5;
let currentSensorPage = 1;

// Hàm để thêm dữ liệu ngẫu nhiên (giả lập) vào lịch sử cảm biến
function addRandomSensorData() {
    const randomTemperature = Math.floor(Math.random() * 15) + 20; // Giả lập nhiệt độ từ 20-35°C
    const randomHumidity = Math.floor(Math.random() * 40) + 30; // Giả lập độ ẩm từ 30-70%
    const randomLight = Math.floor(Math.random() * 400) + 100; // Giả lập ánh sáng từ 100-500 Lux
    const time = new Date().toLocaleString();

    sensorHistoryData.push({
        temperature: randomTemperature,
        humidity: randomHumidity,
        light: randomLight,
        time: time
    });
    renderSensorHistoryTable();
}


// Thiết lập cập nhật dữ liệu mỗi phút
setInterval(addRandomSensorData, 100000); // 60000 ms = 1 phút

// Gọi lần đầu để hiển thị dữ liệu ban đầu ngay lập tức
addRandomSensorData();


function addDeleteButtonEvents() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            sensorHistoryData.splice(index, 1); // Xóa phần tử khỏi mảng
            renderSensorHistoryTable(); // Cập nhật lại bảng
        });
    });
}

function updateSensorPagination(totalPages) {
    const paginationContainer = document.getElementById('sensorPagination');
    paginationContainer.innerHTML = ''; // Xóa các nút phân trang hiện có

    const maxVisiblePages = 3; // Số lượng trang liền kề hiển thị tối đa
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Thêm nút "Trước"
    if (currentSensorPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Trước';
        prevButton.addEventListener('click', () => {
            currentSensorPage--;
            renderSensorHistoryTable();
        });
        paginationContainer.appendChild(prevButton);
    }

    // Hiển thị trang đầu nếu currentSensorPage > 2
    if (currentSensorPage > halfVisible + 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => {
            currentSensorPage = 1;
            renderSensorHistoryTable();
        });
        paginationContainer.appendChild(firstButton);

        if (currentSensorPage > halfVisible + 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    // Hiển thị các trang liền kề xung quanh trang hiện tại
    let startPage = Math.max(1, currentSensorPage - halfVisible);
    let endPage = Math.min(totalPages, currentSensorPage + halfVisible);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        
        // Thêm lớp active-page cho trang hiện tại
        if (i === currentSensorPage) {
            button.classList.add('active-page'); // Đánh dấu trang hiện tại với màu đỏ
        }
        
        button.addEventListener('click', () => {
            currentSensorPage = i;
            renderSensorHistoryTable();
        });
        paginationContainer.appendChild(button);
    }

    // Hiển thị trang cuối nếu currentSensorPage < totalPages - 2
    if (currentSensorPage < totalPages - halfVisible) {
        if (currentSensorPage < totalPages - halfVisible - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }

        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => {
            currentSensorPage = totalPages;
            renderSensorHistoryTable();
        });
        paginationContainer.appendChild(lastButton);
    }

    // Thêm nút "Tiếp theo"
    if (currentSensorPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Tiếp theo';
        nextButton.addEventListener('click', () => {
            currentSensorPage++;
            renderSensorHistoryTable();
        });
        paginationContainer.appendChild(nextButton);
    }
}


function deleteSensorRow(id) {
    let sensorHistory = JSON.parse(localStorage.getItem("sensorHistory")) || [];
    sensorHistory = sensorHistory.filter(sensor => sensor.id !== id);
    localStorage.setItem("sensorHistory", JSON.stringify(sensorHistory));
    renderSensorTable(); // Cập nhật lại bảng sau khi xóa
}

// Hàm để hiển thị phân trang
function renderSensorHistoryTable() {
    const tableBody = document.querySelector('#sensorHistoryTable tbody');
    tableBody.innerHTML = '';

    const start = (currentSensorPage - 1) * sensorItemsPerPage;
    const end = start + sensorItemsPerPage;
    const paginatedData = sensorHistoryData.slice(start, end);

    paginatedData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${item.temperature}</td>
            <td>${item.humidity}</td>
            <td>${item.light}</td>
            <td>${item.time}</td>

        `;
        
        tableBody.appendChild(row);
    });
    addDeleteButtonEvents();
    // Gọi hàm cập nhật phân trang
    const totalPages = Math.ceil(sensorHistoryData.length / sensorItemsPerPage);
    updateSensorPagination(totalPages);
}


// Hàm để tìm kiếm trong Sensor History
function searchSensorHistory() {
    const searchInput = document.getElementById('sensorSearchInput').value.toLowerCase();
    const filteredData = sensorHistoryData.filter(item =>
        item.temperature.toString().includes(searchInput) ||
        item.humidity.toString().includes(searchInput) ||
        item.light.toString().includes(searchInput) ||
        item.time.toLowerCase().includes(searchInput)
    );
    sensorHistoryData = filteredData;
    renderSensorHistoryTable();
}

// Hàm để xóa toàn bộ lịch sử
// function deleteAllSensorHistory() {
//     sensorHistoryData = [];
//     renderSensorHistoryTable();
// }

// Sự kiện khi bấm nút xóa lịch sử cảm biến
document.getElementById('deleteSensorHistoryButton').addEventListener('click', deleteAllSensorHistory);

// Khởi tạo trang ban đầu
renderSensorHistoryTable();

// mqtt


// Cập nhật các hộp thống kê với dữ liệu mới nhất
updateStats();
