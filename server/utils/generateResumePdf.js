const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a professional, beautifully styled PDF resume for the user.
 * @param {Object} db - The in-memory database object containing profile, skills, projects, etc.
 * @param {string} outputPath - The file path where the PDF will be saved.
 * @returns {Promise<string>} - Resolves with the outputPath when writing finishes.
 */
function generateResumePdf(db, outputPath) {
  return new Promise((resolve, reject) => {
    const profile = db.profile || {};
    const name = profile.name || 'CHANDRU R';
    const headline = profile.headline || 'Software Engineer';
    const email = profile.email || 'itismechandru247@gmail.com';
    const location = profile.location || 'Bengaluru, India';
    const github = profile.socialLinks?.github || 'https://github.com/Chandru-247';
    const linkedin = profile.socialLinks?.linkedin || 'https://www.linkedin.com/in/chandru-r-1a93a03b3';

    // Create PDF document (Standard A4, 40pt margins)
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 36, bottom: 36, left: 40, right: 40 },
      info: {
        Title: `${name} - Resume`,
        Author: name,
        Subject: `${headline} Resume`,
        Keywords: 'Software Engineer, Full Stack, Java, DSA, Web Development, Portfolio'
      }
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Color Palette
    const primaryColor = '#0f172a'; // Deep slate
    const accentColor = '#0284c7';  // Tech cyan-blue
    const darkGray = '#334155';     // Slate 700
    const lightGray = '#64748b';    // Slate 500
    const lineColor = '#cbd5e1';    // Slate 300

    // Helper: Section Header
    function addSectionHeader(title) {
      doc.moveDown(0.6);
      doc.fontSize(11).font('Helvetica-Bold').fillColor(accentColor).text(title.toUpperCase(), { characterSpacing: 1 });
      const y = doc.y + 2;
      doc.moveTo(40, y).lineTo(555, y).lineWidth(1).strokeColor(accentColor).stroke();
      doc.moveDown(0.4);
    }

    // --- HEADER ---
    doc.fontSize(22).font('Helvetica-Bold').fillColor(primaryColor).text(name.toUpperCase(), { align: 'center' });
    doc.moveDown(0.15);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(accentColor).text(headline.toUpperCase(), { align: 'center', characterSpacing: 0.8 });
    doc.moveDown(0.2);

    // Contact info bar
    const contactLine = `${location}  |  ${email}  |  GitHub: ${github.replace('https://', '')}  |  LinkedIn: ${linkedin.replace('https://www.', '').replace('https://', '')}`;
    doc.fontSize(8.5).font('Helvetica').fillColor(lightGray).text(contactLine, { align: 'center' });

    // Header divider
    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(1.5).strokeColor(lineColor).stroke();

    // --- PROFESSIONAL SUMMARY ---
    addSectionHeader('Professional Summary');
    const summaryText = profile.bio || 
      'Passionate and results-driven Computer Science Engineer with strong expertise in Java, Data Structures & Algorithms, and modern Full-Stack Web Development. Proven algorithmic problem solver (650+ DSA problems solved) with experience building scalable distributed web services, RESTful APIs, and responsive interactive web applications.';
    doc.fontSize(9).font('Helvetica').fillColor(darkGray).text(summaryText, {
      align: 'justify',
      lineGap: 2.5
    });

    // --- EDUCATION ---
    addSectionHeader('Education & Career Journey');
    const educationList = profile.education || [];
    educationList.forEach((edu) => {
      // Degree & Period row
      const startY = doc.y;
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(primaryColor).text(edu.degree, 40, startY, { width: 380 });
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(accentColor).text(edu.period || '', 420, startY, { width: 135, align: 'right' });

      // Institution & Grade row
      const instY = doc.y + 1;
      doc.fontSize(9).font('Helvetica').fillColor(darkGray).text(edu.institution, 40, instY, { width: 380 });
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(darkGray).text(edu.grade || '', 420, instY, { width: 135, align: 'right' });

      // Highlights
      if (edu.highlights) {
        doc.moveDown(0.2);
        doc.fontSize(8.5).font('Helvetica').fillColor(lightGray).text(`• ${edu.highlights}`, 48, doc.y, { width: 507, lineGap: 1 });
      }
      doc.moveDown(0.4);
    });

    // --- TECHNICAL SKILLS ---
    addSectionHeader('Technical Skills');
    const skillsByCategory = {};
    (db.skills || []).forEach(s => {
      const cat = s.category || 'General';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(s.name);
    });

    // Default categories if empty
    if (Object.keys(skillsByCategory).length === 0) {
      skillsByCategory['Languages'] = ['Java', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'C/C++'];
      skillsByCategory['Web & Frontend'] = ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux'];
      skillsByCategory['Backend & Cloud'] = ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'];
      skillsByCategory['Core Competencies'] = ['Data Structures & Algorithms (650+)', 'System Design', 'OOP', 'Git/GitHub'];
    }

    Object.entries(skillsByCategory).forEach(([category, items]) => {
      const catY = doc.y;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text(`• ${category}: `, 40, catY, { continued: true });
      doc.font('Helvetica').fillColor(darkGray).text(items.join(', '));
      doc.moveDown(0.25);
    });

    // --- KEY PROJECTS ---
    addSectionHeader('Key Software Projects');
    const projects = (db.projects || []).slice(0, 3);
    projects.forEach((proj) => {
      const projY = doc.y;
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(primaryColor).text(proj.title, 40, projY, { width: 380 });
      const tagText = (proj.tags || []).slice(0, 4).join(' | ');
      doc.fontSize(8).font('Helvetica-Oblique').fillColor(accentColor).text(tagText, 380, projY, { width: 175, align: 'right' });

      doc.moveDown(0.15);
      doc.fontSize(8.5).font('Helvetica').fillColor(darkGray).text(proj.description || '', 40, doc.y, { width: 515, lineGap: 1.5 });
      
      if (proj.github || proj.demo) {
        doc.moveDown(0.15);
        const links = [];
        if (proj.github) links.push(`GitHub: ${proj.github}`);
        if (proj.demo) links.push(`Live: ${proj.demo}`);
        doc.fontSize(7.5).font('Helvetica').fillColor(lightGray).text(links.join('   |   '), 40, doc.y);
      }
      doc.moveDown(0.4);
    });

    // --- CERTIFICATIONS & MILESTONES ---
    addSectionHeader('Certifications & Milestones');
    const certs = (db.certificates || []).slice(0, 3);
    certs.forEach((cert) => {
      const cY = doc.y;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text(`• ${cert.title}`, 40, cY, { width: 400 });
      doc.fontSize(8).font('Helvetica').fillColor(lightGray).text(cert.issuer || '', 440, cY, { width: 115, align: 'right' });
      doc.moveDown(0.2);
    });

    // Career Goal Callout
    const activeGoal = (profile.careerGoals || []).find(g => g.status === 'Currently Pursuing');
    if (activeGoal) {
      doc.moveDown(0.3);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(accentColor).text(`Target Direction: `, 40, doc.y, { continued: true });
      doc.font('Helvetica').fillColor(darkGray).text(activeGoal.goal || 'Software Development Engineer (SDE)');
    }

    doc.end();

    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', (err) => reject(err));
  });
}

module.exports = { generateResumePdf };
