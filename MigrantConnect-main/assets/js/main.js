// MigrantConnect - Main JavaScript File

// User data simulation
const users = {
    'ravi_kumar': {
        name: 'Ravi Kumar',
        id: 'MIG-BH-001',
        homeState: 'Bihar',
        currentState: 'Delhi',
        phone: '+91-9876543210',
        aadhaar: '****-****-1234',
        benefits: {
            food: { status: 'active', usage: 75 },
            health: { status: 'active', usage: 25 },
            education: { status: 'pending', usage: 0 },
            finance: { status: 'active', usage: 60 }
        }
    },
    'priya_sharma': {
        name: 'Priya Sharma',
        id: 'MIG-UP-002',
        homeState: 'Uttar Pradesh',
        currentState: 'Maharashtra',
        phone: '+91-9876543211',
        aadhaar: '****-****-5678',
        benefits: {
            food: { status: 'active', usage: 50 },
            health: { status: 'active', usage: 30 },
            education: { status: 'active', usage: 80 },
            finance: { status: 'active', usage: 40 }
        }
    },
    'amit_das': {
        name: 'Amit Das',
        id: 'MIG-WB-003',
        homeState: 'West Bengal',
        currentState: 'Karnataka',
        phone: '+91-9876543212',
        aadhaar: '****-****-9012',
        benefits: {
            food: { status: 'active', usage: 90 },
            health: { status: 'active', usage: 15 },
            education: { status: 'active', usage: 45 },
            finance: { status: 'pending', usage: 0 }
        }
    },
    'sunita_devi': {
        name: 'Sunita Devi',
        id: 'MIG-RJ-004',
        homeState: 'Rajasthan',
        currentState: 'Gujarat',
        phone: '+91-9876543213',
        aadhaar: '****-****-3456',
        benefits: {
            food: { status: 'active', usage: 65 },
            health: { status: 'active', usage: 35 },
            education: { status: 'active', usage: 70 },
            finance: { status: 'active', usage: 55 }
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    checkOnlineStatus();
    initializeTranslations();

    // Check which page we're on and initialize accordingly
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeLoginPage();
    } else if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    } else if (window.location.pathname.includes('qr.html')) {
        initializeQRPage();
    }

    // Set up offline/online event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
});

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Login page initialization
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    const migrantId = document.getElementById('migrantId').value;
    const language = document.getElementById('language').value;

    if (!migrantId) {
        showAlert('Please select a user', 'warning');
        return;
    }

    // Store user data
    localStorage.setItem('currentUser', migrantId);
    localStorage.setItem('selectedLanguage', language);

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Dashboard initialization
function initializeDashboard() {
    if (!checkAuth()) return;

    const currentUser = localStorage.getItem('currentUser');
    const userData = users[currentUser];

    if (userData) {
        updateWelcomeMessage(userData);
        updateBenefitCards(userData);
    }
}

// Update welcome message
function updateWelcomeMessage(userData) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userLocation = document.getElementById('userLocation');

    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome ${userData.name}! 👋`;
    }

    if (userLocation) {
        userLocation.textContent = `From ${userData.homeState}, currently in ${userData.currentState}`;
    }
}

// Update benefit cards with user data
function updateBenefitCards(userData) {
    const benefitCards = document.querySelectorAll('.benefit-card');

    benefitCards.forEach(card => {
        const benefitType = card.getAttribute('data-benefit');
        const benefit = userData.benefits[benefitType];

        if (benefit) {
            const statusBadge = card.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = benefit.status;
                statusBadge.className = `badge ${benefit.status === 'active' ? 'bg-success' : 'bg-warning'}`;
            }
        }
    });
}

// QR Page initialization
function initializeQRPage() {
    if (!checkAuth()) return;

    const currentUser = localStorage.getItem('currentUser');
    const userData = users[currentUser];

    if (userData) {
        updateQRUserInfo(userData);
        generateQRCode(userData);
    }
}

// Update QR page user information
function updateQRUserInfo(userData) {
    const qrUserName = document.getElementById('qr-user-name');
    const qrUserId = document.getElementById('qr-user-id');
    const qrUserLocation = document.getElementById('qr-user-location');
    const qrIssueDate = document.getElementById('qr-issue-date');
    const qrExpiryDate = document.getElementById('qr-expiry-date');

    if (qrUserName) qrUserName.textContent = userData.name;
    if (qrUserId) qrUserId.textContent = `ID: ${userData.id}`;
    if (qrUserLocation) qrUserLocation.textContent = `From: ${userData.homeState}, Currently in: ${userData.currentState}`;

    // Set dates
    const issueDate = new Date();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (qrIssueDate) qrIssueDate.textContent = issueDate.toLocaleDateString();
    if (qrExpiryDate) qrExpiryDate.textContent = expiryDate.toLocaleDateString();
}

// Generate QR Code with unique user data
function generateQRCode(userData) {
    const qrCodeDiv = document.getElementById('qrcode');
    if (qrCodeDiv) {
        // Clear existing QR code
        qrCodeDiv.innerHTML = '';

        // Create comprehensive QR code data with user-specific information
        const qrData = {
            // Basic Identity
            migrantId: userData.id,
            name: userData.name,
            aadhaar: userData.aadhaar,
            phone: userData.phone,

            // Location Data
            homeState: userData.homeState,
            currentState: userData.currentState,

            // Benefits Status
            benefits: {
                food: {
                    status: userData.benefits.food.status,
                    usage: userData.benefits.food.usage,
                    entitlement: "5kg Rice, 5kg Wheat, 1kg Sugar, 1L Oil",
                    validTill: "2025-03-31"
                },
                health: {
                    status: userData.benefits.health.status,
                    usage: userData.benefits.health.usage,
                    cardNumber: "AB-" + userData.id.split('-')[1] + "-" + userData.aadhaar.slice(-4),
                    coverage: "₹5,00,000",
                    validTill: "2025-03-31"
                },
                education: {
                    status: userData.benefits.education.status,
                    usage: userData.benefits.education.usage,
                    children: userData.name === 'Ravi Kumar' ? 2 :
                        userData.name === 'Priya Sharma' ? 1 :
                            userData.name === 'Amit Das' ? 3 : 1
                },
                finance: {
                    status: userData.benefits.finance.status,
                    usage: userData.benefits.finance.usage,
                    bankAccount: "****" + userData.aadhaar.slice(-4),
                    balance: "₹15,450"
                }
            },

            // Metadata
            issueDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            issuer: "MigrantConnect Digital Identity System",
            version: "1.0",

            // Security
            checksum: generateChecksum(userData),
            digitalSignature: generateDigitalSignature(userData)
        };

        // Generate QR code with the comprehensive data
        const qr = new QRCode(qrCodeDiv, {
            text: JSON.stringify(qrData),
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        // Store QR data globally for download/sharing
        window.currentQRData = qrData;

        // Add visual indicator for unique QR
        addQRUniqueIndicator(qrCodeDiv, userData);
    }
}

// Generate checksum for data integrity
function generateChecksum(userData) {
    const dataString = userData.id + userData.name + userData.aadhaar + userData.phone;
    let checksum = 0;
    for (let i = 0; i < dataString.length; i++) {
        checksum += dataString.charCodeAt(i);
    }
    return (checksum % 10000).toString().padStart(4, '0');
}

// Generate digital signature (simplified)
function generateDigitalSignature(userData) {
    const timestamp = Date.now();
    const dataHash = generateChecksum(userData);
    const signature = btoa(timestamp + dataHash + userData.id).slice(0, 16);
    return signature;
}

// Add visual indicator showing QR uniqueness
function addQRUniqueIndicator(qrContainer, userData) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: absolute;
        top: -25px;
        right: -10px;
        background: #28a745;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: bold;
    `;
    indicator.textContent = `ID: ${userData.id.split('-')[2]}`;
    qrContainer.style.position = 'relative';
    qrContainer.appendChild(indicator);
}

// Quick Actions
function quickApply(benefitType) {
    showAlert(`Application submitted for ${benefitType} benefits!`, 'success');
}

function applyForBenefit(benefitType) {
    showAlert(`Redirecting to ${benefitType} benefit application...`, 'info');
    // Simulate application process
    setTimeout(() => {
        showAlert(`Application for ${benefitType} benefits submitted successfully!`, 'success');
    }, 1500);
}

function downloadCard(cardType) {
    showAlert(`Downloading ${cardType} card...`, 'info');
    // Simulate download
    setTimeout(() => {
        showAlert(`${cardType} card downloaded successfully!`, 'success');
    }, 1000);
}

function downloadAllCards() {
    showAlert('Downloading all benefit cards...', 'info');
    setTimeout(() => {
        showAlert('All cards downloaded successfully!', 'success');
    }, 1500);
}

function findNearestCenter() {
    showAlert('Finding nearest service center...', 'info');
    setTimeout(() => {
        showAlert('Nearest center: 123 Main Street, 2.5 km away', 'info');
    }, 1000);
}

function findNearestHospital() {
    showAlert('Finding nearest hospital...', 'info');
    setTimeout(() => {
        showAlert('Nearest hospital: City Hospital, 1.8 km away', 'info');
    }, 1000);
}

function findNearestSchool() {
    showAlert('Finding nearby schools...', 'info');
    setTimeout(() => {
        showAlert('Found 5 schools within 3 km radius', 'info');
    }, 1000);
}

function findNearestBank() {
    showAlert('Finding nearest bank...', 'info');
    setTimeout(() => {
        showAlert('Nearest bank: State Bank of India, 800m away', 'info');
    }, 1000);
}

function contactSupport() {
    showAlert('Connecting to support...', 'info');
    setTimeout(() => {
        showAlert('Support available at 1800-123-4567', 'info');
    }, 1000);
}

function reportIssue(benefitType) {
    showAlert(`Reporting issue with ${benefitType} benefits...`, 'warning');
    setTimeout(() => {
        showAlert('Issue reported successfully. Reference ID: INC123456', 'success');
    }, 1000);
}

function transferBenefits(benefitType) {
    showAlert(`Initiating ${benefitType} benefit transfer...`, 'info');
    setTimeout(() => {
        showAlert('Transfer process initiated. You will receive updates via SMS.', 'success');
    }, 1500);
}

// Financial Actions
function checkBalance() {
    showAlert('Checking account balance...', 'info');
    setTimeout(() => {
        showAlert('Current Balance: ₹15,450', 'success');
    }, 1000);
}

function transferMoney() {
    showAlert('Redirecting to money transfer...', 'info');
    setTimeout(() => {
        showAlert('Transfer initiated successfully!', 'success');
    }, 1500);
}

function applyForLoan() {
    showAlert('Processing loan application...', 'info');
    setTimeout(() => {
        showAlert('Loan application submitted. You are eligible for ₹50,000', 'success');
    }, 1500);
}

// Health Actions
function bookAppointment() {
    showAlert('Booking appointment...', 'info');
    setTimeout(() => {
        showAlert('Appointment booked for tomorrow at 10:00 AM', 'success');
    }, 1000);
}

function emergencyContact() {
    showAlert('Emergency services: 108', 'danger');
}

function setReminder() {
    showAlert('Medicine reminder set for 8:00 AM daily', 'success');
}

// Education Actions
function applyForAdmission() {
    showAlert('Redirecting to school admission portal...', 'info');
    setTimeout(() => {
        showAlert('Admission application submitted successfully!', 'success');
    }, 1500);
}

function applyForScholarship() {
    showAlert('Processing scholarship application...', 'info');
    setTimeout(() => {
        showAlert('Scholarship application submitted successfully!', 'success');
    }, 1500);
}

function downloadCertificates() {
    showAlert('Downloading certificates...', 'info');
    setTimeout(() => {
        showAlert('All certificates downloaded successfully!', 'success');
    }, 1000);
}

function initiateTransfer() {
    showAlert('Initiating school transfer process...', 'info');
    setTimeout(() => {
        showAlert('Transfer process initiated. Required documents will be sent via email.', 'success');
    }, 1500);
}

// Finance Actions
function accessLiteracy() {
    showAlert('Accessing financial literacy resources...', 'info');
    setTimeout(() => {
        showAlert('Resources loaded. Check your mobile for the link.', 'success');
    }, 1000);
}

function exploreInvestments() {
    showAlert('Loading investment options...', 'info');
    setTimeout(() => {
        showAlert('Investment options available: PPF, NSC, ELSS', 'info');
    }, 1000);
}

// QR Actions - Enhanced functionality
function downloadQRCode() {
    const qrCodeDiv = document.getElementById('qrcode');
    const svg = qrCodeDiv.querySelector('svg');

    if (svg) {
        // Convert SVG to PNG and download
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function () {
            canvas.width = 400; // Higher resolution
            canvas.height = 400;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 400, 400);
            ctx.drawImage(img, 0, 0, 400, 400);

            // Add user info to the image
            const currentUser = localStorage.getItem('currentUser');
            const userData = users[currentUser];

            if (userData) {
                ctx.fillStyle = 'black';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(userData.name, 200, 430);
                ctx.fillText(`ID: ${userData.id}`, 200, 450);
                ctx.fillText(`Valid till: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 200, 470);
            }

            // Download the image
            const link = document.createElement('a');
            link.download = `MigrantConnect-QR-${userData ? userData.id : 'code'}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        showAlert('QR code downloaded successfully!', 'success');
    } else {
        showAlert('Error: QR code not found', 'error');
    }
}

function shareQRCode() {
    const currentUser = localStorage.getItem('currentUser');
    const userData = users[currentUser];

    if (navigator.share && userData) {
        // Use native sharing if available
        navigator.share({
            title: 'MigrantConnect Digital Identity',
            text: `Digital ID for ${userData.name} (${userData.id}) - Access government services across India`,
            url: window.location.href
        }).then(() => {
            showAlert('QR code shared successfully!', 'success');
        }).catch(() => {
            fallbackShare(userData);
        });
    } else {
        fallbackShare(userData);
    }
}

function fallbackShare(userData) {
    // Fallback sharing method
    const qrInfo = `
MigrantConnect Digital Identity
Name: ${userData.name}
ID: ${userData.id}
From: ${userData.homeState}
Currently in: ${userData.currentState}
Valid till: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

This QR code provides access to government services across India.
    `.trim();

    if (navigator.clipboard) {
        navigator.clipboard.writeText(qrInfo).then(() => {
            showAlert('QR code information copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = qrInfo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showAlert('QR code information copied to clipboard!', 'success');
    }
}

function printQRCode() {
    const currentUser = localStorage.getItem('currentUser');
    const userData = users[currentUser];

    if (userData) {
        // Create printable version
        const printWindow = window.open('', '_blank');
        const qrCodeDiv = document.getElementById('qrcode');
        const svg = qrCodeDiv.querySelector('svg');

        if (svg) {
            const svgString = new XMLSerializer().serializeToString(svg);

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>MigrantConnect QR Code - ${userData.name}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 20px;
                            background: white;
                        }
                        .qr-container { 
                            border: 2px solid #000; 
                            padding: 20px; 
                            margin: 20px auto;
                            max-width: 400px;
                            background: white;
                        }
                        .header { 
                            background: #007bff; 
                            color: white; 
                            padding: 10px; 
                            margin: -20px -20px 20px -20px;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .user-info { 
                            margin: 20px 0; 
                            font-size: 14px;
                        }
                        .instructions { 
                            font-size: 12px; 
                            color: #666; 
                            margin-top: 20px;
                            text-align: left;
                        }
                        .qr-code { 
                            margin: 20px 0; 
                        }
                        .footer { 
                            font-size: 10px; 
                            color: #999; 
                            margin-top: 20px;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <div class="header">🏠 MigrantConnect Digital Identity</div>
                        <div class="user-info">
                            <strong>${userData.name}</strong><br>
                            ID: ${userData.id}<br>
                            From: ${userData.homeState} → Currently in: ${userData.currentState}<br>
                            Phone: ${userData.phone}
                        </div>
                        <div class="qr-code">
                            ${svgString}
                        </div>
                        <div class="instructions">
                            <strong>How to use:</strong><br>
                            • Show this QR code at any government service center<br>
                            • Scan for instant benefit verification<br>
                            • Works without internet connection<br>
                            • Valid till: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}<br>
                            • Keep this document secure and private
                        </div>
                        <div class="footer">
                            Generated on: ${new Date().toLocaleString()}<br>
                            MigrantConnect - Bridging Services Across States
                        </div>
                    </div>
                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();

            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);

            showAlert('QR code prepared for printing!', 'success');
        } else {
            showAlert('Error: QR code not found', 'error');
        }
    }
}

// Add QR code validation function
function validateQRCode(qrData) {
    try {
        const data = JSON.parse(qrData);

        // Check required fields
        const requiredFields = ['migrantId', 'name', 'aadhaar', 'benefits', 'checksum'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return { valid: false, reason: `Missing required field: ${field}` };
            }
        }

        // Check expiry
        if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
            return { valid: false, reason: 'QR code has expired' };
        }

        // Validate checksum (simplified)
        const userData = users[Object.keys(users).find(key => users[key].id === data.migrantId)];
        if (userData && generateChecksum(userData) !== data.checksum) {
            return { valid: false, reason: 'Invalid checksum' };
        }

        return { valid: true, data: data };
    } catch (error) {
        return { valid: false, reason: 'Invalid QR code format' };
    }
}

// Simulate QR code scanning for demo
function simulateQRScan() {
    if (!window.currentQRData) {
        showAlert('No QR code generated yet!', 'warning');
        return;
    }

    showAlert('Scanning QR code...', 'info');

    setTimeout(() => {
        const validation = validateQRCode(JSON.stringify(window.currentQRData));

        if (validation.valid) {
            const data = validation.data;
            showQRScanResult(data);
        } else {
            showAlert(`QR validation failed: ${validation.reason}`, 'error');
        }
    }, 1500);
}

// Show QR scan result
function showQRScanResult(data) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-check-circle"></i> QR Code Verified Successfully
                    </h5>
                    <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6><i class="fas fa-user"></i> Personal Information</h6>
                            <ul class="list-unstyled">
                                <li><strong>Name:</strong> ${data.name}</li>
                                <li><strong>ID:</strong> ${data.migrantId}</li>
                                <li><strong>Phone:</strong> ${data.phone}</li>
                                <li><strong>From:</strong> ${data.homeState}</li>
                                <li><strong>Currently in:</strong> ${data.currentState}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6><i class="fas fa-shield-alt"></i> Security Information</h6>
                            <ul class="list-unstyled">
                                <li><strong>Issue Date:</strong> ${new Date(data.issueDate).toLocaleDateString()}</li>
                                <li><strong>Expiry:</strong> ${new Date(data.expiryDate).toLocaleDateString()}</li>
                                <li><strong>Checksum:</strong> ${data.checksum}</li>
                                <li><strong>Status:</strong> <span class="badge bg-success">Valid</span></li>
                            </ul>
                        </div>
                    </div>
                    
                    <h6 class="mt-3"><i class="fas fa-clipboard-list"></i> Available Benefits</h6>
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-bread-slice fa-2x text-warning"></i>
                                <div><strong>Food</strong></div>
                                <div><span class="badge bg-${data.benefits.food.status === 'active' ? 'success' : 'warning'}">${data.benefits.food.status}</span></div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-heartbeat fa-2x text-danger"></i>
                                <div><strong>Health</strong></div>
                                <div><span class="badge bg-${data.benefits.health.status === 'active' ? 'success' : 'warning'}">${data.benefits.health.status}</span></div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-graduation-cap fa-2x text-primary"></i>
                                <div><strong>Education</strong></div>
                                <div><span class="badge bg-${data.benefits.education.status === 'active' ? 'success' : 'warning'}">${data.benefits.education.status}</span></div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-university fa-2x text-info"></i>
                                <div><strong>Finance</strong></div>
                                <div><span class="badge bg-${data.benefits.finance.status === 'active' ? 'success' : 'warning'}">${data.benefits.finance.status}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="this.closest('.modal').remove(); showAlert('Service access granted!', 'success')">Grant Service Access</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 30000);
}

// Online/Offline Status
function checkOnlineStatus() {
    if (!navigator.onLine) {
        showOfflineBanner();
    }
}

function handleOnline() {
    hideOfflineBanner();
    showAlert('Connection restored!', 'success');
}

function handleOffline() {
    showOfflineBanner();
    showAlert('You are now offline. Showing cached data.', 'warning');
}

function showOfflineBanner() {
    const offlineBanner = document.getElementById('offline-banner');
    if (offlineBanner) {
        offlineBanner.classList.remove('d-none');
    }
}

function hideOfflineBanner() {
    const offlineBanner = document.getElementById('offline-banner');
    if (offlineBanner) {
        offlineBanner.classList.add('d-none');
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1060; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to body
    document.body.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function initializeTranslations() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    loadLanguage(savedLanguage);
}

// Add smooth scrolling
document.addEventListener('DOMContentLoaded', function () {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add animation classes to cards
function addAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(addAnimations, 100);
});
