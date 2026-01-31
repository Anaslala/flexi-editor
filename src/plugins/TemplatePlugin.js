import { Icons } from '../ui/Icons';

export class TemplatePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Template';
        this.templates = [
            {
                name: 'Privacy Policy',
                description: 'Complete privacy policy template for websites',
                icon: '🔒',
                html: `<h1>Privacy Policy</h1>
<p><em>Last updated: January 31, 2026</em></p>

<p>This Privacy Policy describes how we collect, use, and protect your personal information when you use our services.</p>

<h2>1. Information We Collect</h2>
<p>We collect several types of information to provide and improve our services:</p>
<ul>
    <li><strong>Personal Information:</strong> Name, email address, phone number, and billing information</li>
    <li><strong>Usage Data:</strong> Information about how you interact with our services</li>
    <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
    <li><strong>Cookies:</strong> Small data files stored on your device to enhance user experience</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use the collected information for the following purposes:</p>
<ul>
    <li>To provide, maintain, and improve our services</li>
    <li>To process transactions and send related information</li>
    <li>To send you technical notices, updates, and support messages</li>
    <li>To respond to your comments, questions, and customer service requests</li>
    <li>To monitor and analyze trends, usage, and activities</li>
</ul>

<h2>3. Data Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>

<h2>4. Your Rights</h2>
<p>You have the right to:</p>
<ul>
    <li>Access and receive a copy of your personal data</li>
    <li>Rectify inaccurate or incomplete data</li>
    <li>Request deletion of your personal data</li>
    <li>Object to or restrict processing of your data</li>
    <li>Withdraw consent at any time</li>
</ul>

<h2>5. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us:</p>
<p><strong>Email:</strong> privacy@yourcompany.com</p>
<p><strong>Address:</strong> 123 Business Street, City, State 12345</p>
<p><strong>Phone:</strong> (555) 123-4567</p>`
            },
            {
                name: 'About',
                description: 'Professional about page with company story',
                icon: '🏢',
                html: `<h1>About Us</h1>
<p>Building innovative solutions that empower people and transform businesses worldwide.</p>

<h2>Our Mission</h2>
<p>To create technology that makes a meaningful difference in people's lives by combining innovation, design excellence, and a deep understanding of user needs.</p>

<h2>Our Story</h2>
<p>Founded in 2020, our company started with a simple idea: technology should be accessible, intuitive, and powerful. What began as a small team of passionate developers has grown into a thriving organization serving thousands of customers worldwide.</p>

<p>We believe in the power of collaboration, continuous learning, and pushing boundaries. Every product we build is crafted with attention to detail and a commitment to excellence that sets us apart.</p>

<p>Today, we're proud to be at the forefront of innovation, helping businesses and individuals achieve their goals through cutting-edge technology solutions.</p>

<h2>Our Values</h2>
<h3>Innovation</h3>
<p>We constantly push boundaries and explore new possibilities to stay ahead of the curve.</p>

<h3>Integrity</h3>
<p>We build trust through transparency, honesty, and ethical business practices.</p>

<h3>Excellence</h3>
<p>We strive for the highest quality in everything we do, from code to customer service.</p>

<h2>Join Our Journey</h2>
<p>We're always looking for talented individuals who share our passion for innovation. <a href="#careers">View Open Positions</a></p>`
            },
            {
                name: 'Product Description',
                description: 'E-commerce product page with features and specs',
                icon: '📦',
                html: `<h1>Premium Wireless Headphones</h1>
<p>⭐⭐⭐⭐⭐ (4.8 out of 5 from 2,847 reviews)</p>

<p><strong>Price:</strong> $299 <del>$399</del> (Save 25%)</p>

<h2>Product Overview</h2>
<p>Experience studio-quality sound with our flagship wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and premium comfort for all-day wear.</p>

<h2>Key Features</h2>
<ul>
    <li><strong>Hi-Res Audio:</strong> 40mm drivers deliver crystal-clear sound with deep bass and crisp highs</li>
    <li><strong>Active Noise Cancellation:</strong> Block out distractions with industry-leading ANC technology</li>
    <li><strong>40-Hour Battery:</strong> All-day listening with fast charging - 5 minutes for 3 hours of playback</li>
    <li><strong>Premium Comfort:</strong> Memory foam ear cushions and adjustable headband for perfect fit</li>
</ul>

<h2>What's Included</h2>
<ul>
    <li>✓ Free shipping on orders over $50</li>
    <li>✓ 30-day money-back guarantee</li>
    <li>✓ 2-year warranty included</li>
</ul>

<h2>Technical Specifications</h2>
<ul>
    <li><strong>Driver Size:</strong> 40mm</li>
    <li><strong>Frequency Response:</strong> 20Hz - 40kHz</li>
    <li><strong>Bluetooth Version:</strong> 5.3</li>
    <li><strong>Weight:</strong> 250g</li>
    <li><strong>Charging Time:</strong> 2 hours</li>
    <li><strong>Connectivity:</strong> Bluetooth, 3.5mm jack</li>
</ul>`
            }
        ];
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('template', {
            title: 'Insert Template',
            icon: Icons.template,
            command: 'insertTemplate',
            onAction: (editor) => {
                this.showTemplatePicker();
            }
        });
    }

    showTemplatePicker() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const picker = document.createElement('div');
        picker.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            width: 600px;
            max-width: 90vw;
            max-height: 550px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'padding: 20px; border-bottom: 1px solid #e5e7eb;';

        const title = document.createElement('h3');
        title.textContent = 'Choose a Template';
        title.style.cssText = 'margin: 0; font-size: 20px; font-weight: 700; color: #1f2937;';

        header.appendChild(title);

        // Content area
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
        `;

        this.templates.forEach(template => {
            const card = document.createElement('div');
            card.style.cssText = `
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s;
                background: white;
                display: flex;
                flex-direction: column;
                gap: 8px;
            `;

            const iconEl = document.createElement('div');
            iconEl.textContent = template.icon;
            iconEl.style.cssText = 'font-size: 40px; text-align: center;';

            const nameEl = document.createElement('div');
            nameEl.textContent = template.name;
            nameEl.style.cssText = 'font-size: 16px; font-weight: 700; color: #1f2937; text-align: center;';

            const descEl = document.createElement('div');
            descEl.textContent = template.description;
            descEl.style.cssText = 'font-size: 12px; color: #6b7280; text-align: center; line-height: 1.4;';

            card.appendChild(iconEl);
            card.appendChild(nameEl);
            card.appendChild(descEl);

            card.onmouseenter = () => {
                card.style.borderColor = '#1b9af7';
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            };

            card.onmouseleave = () => {
                card.style.borderColor = '#e5e7eb';
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            };

            card.onclick = () => {
                this.insertTemplate(template.html);
                overlay.remove();
            };

            grid.appendChild(card);
        });

        content.appendChild(grid);
        picker.appendChild(header);
        picker.appendChild(content);
        overlay.appendChild(picker);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    insertTemplate(html) {
        this.editor.selection.restoreSelection();
        this.editor.contentArea.focus();
        this.editor.execCommand('insertHTML', html);
        this.editor.trigger('change');
    }
}
