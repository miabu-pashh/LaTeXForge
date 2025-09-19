// export function buildGeminiPrompt({
//   jobDescription,
//   resumeTemplate,
//   coverLetterTemplate,
//   coldEmailTemplate,
// }) {
//   return `
// You are an expert LaTeX resume assistant and job application writer.
// Based on the job description and the provided resume template,
// your task is to generate tailored updates in LaTeX and professional
// communication materials.

// ===========================
// 🧾 CONTEXT:
// ===========================
// This is the original LaTeX resume template:
// \`\`\`latex
// ${resumeTemplate}
// \`\`\`

// This is the cover letter template:
// \`\`\`
// ${coverLetterTemplate}
// \`\`\`

// This is the cold outreach email template:
// \`\`\`
// ${coldEmailTemplate}
// \`\`\`

// ===========================
// 📌 YOUR TASK:
// ===========================
// Based on the job description:

// Rewrite my LaTeX resume to align with the target role using ATS-friendly formatting by following the requirements below.

// Requirements:
// 1. Bullet Point Format:
//    - Use Google's XYZ format: "Accomplished [X] by doing [Y] using [Z]"
//      * X = quantifiable achievement/impact
//      * Y = specific action/method
//      * Z = tools/technologies/skills used
// 2. Content Optimization:
//    - Quantify everything: Include revenue, cost savings, percentages, timeframes.
//    - Keyword integration: Naturally incorporate job posting keywords.
//    - Industry alignment: Match tone and terminology from job description.
//    - Skill enhancement: Integrate relevant skills from job posting that may be missing.
//    - Conciseness: Maximum 2 lines per bullet point.
// 3. Strategic Alignment:
//    - Job titles: Suggest optimized titles that align with the target role.
//    - Professional headline: Recommend updated title under my name.
//    - Experience prioritization: Highlight most relevant experiences first.
// 4. ATS Compliance:
//    - Use standard formatting.
//    - Include exact keyword matches.
//    - Maintain clear section headers.
//    - Ensure readability by both ATS and humans.

// Output Format:
// 1. Optimized Experience Section with rewritten bullet points.
// 2. Suggested Job Titles for each role.
// 3. Professional Headline recommendation.
// 4. Executive Summary (4-5 lines covering key qualifications and value proposition from job description and experience).

// Success Metrics:
// - 90%+ keyword match with job posting.
// - Quantified impact in every bullet point.
// - Clear value proposition alignment.
// - ATS-friendly structure maintained.

// ===========================

// Tasks:
// 1. ✏️ Update the **Summary section**:
//    - Keep the **first bullet point as-is** from the resume.
//    - Replace the second and third bullet points with two new bullet points relevant to the job description.
//    - Do not add education in the professional summary.
//    - Return valid LaTeX code for the entire \`\\begin{rSection}{Summary}...\` block.

// 2. 🛠 Update the **Technical Skills section**:
//    - Retain existing skills but remove irrelevant ones and add mandatory skills from the job description.
//    - Ensure skills fit within the same number of lines as before.
//    - Return updated LaTeX code for the full \`\\begin{rSection}{Technical Skills}...\` block.

// 3. 🏢 Update **MetLife experience**:
//    - Use strong, unique action verbs not repeated elsewhere in the resume.
//    - Add quantitative measures to each bullet point.
//    - Rewrite all bullet points based on the job description.
//    - Return the entire LaTeX block for MetLife with the original heading and structure unchanged.

// 4. 🏢 Update **Adons Soft Tech experience**:
//    - Use strong, unique action verbs not repeated elsewhere in the resume.
//    - Add quantitative measures to each bullet point.
//    - Rewrite all bullet points based on the job description.
//    - Return the full LaTeX block for Adons Soft Tech.

// 5. Do not make any changes to the **Internships section**.

// 6. Explain the changes made in the Summary, Technical Skills, MetLife, and Adons Soft Tech sections in a concise manner, focusing on how they align with the job description.
// - Ensure quantitative measures are in bold text like \\textbf{20\\%}, Do not bold text in technical section.

// 7. 📄 Generate a professional **cover letter** using the provided template, aligned with the job description. Update the date, company address, and placeholders based on the job description.

// 8. ✉️ Generate a personalized **cold email** to reach out to a recruiter, based on the cold email template and resume. Fill in missing values from the job description.

// 9. Provide the final LaTeX code for the resume, ensuring no changes are made to the Nagarro work experience. Output the LaTeX code with escaped text like \\\\documentclass{resume} and \\\\end{document}.

// 10. Extract the company name from the job description and return it as a string.

// ===========================
// 📝 OUTPUT FORMAT:
// ===========================
// Respond ONLY with valid JSON.

// All LaTeX content must:
// - Be escaped using double backslashes (\\\\\\\\) for every LaTeX command.
// - Replace apostrophes (\\\`\\\`) inside LaTeX text with \\\\textquotesingle{} to avoid JSON parse errors.

// Example format:
// \`\`\`json
// {
//   "companyName": "Company Name",
//   "summaryLatex": "Your LaTeX with escaped text like \\\\begin{itemize} and \\\\item ...",
//   "skillsLatex": "Your LaTeX for skills section with \\\\begin{tabular}...",
//   "metlifeLatex": "Your LaTeX block for MetLife experience with \\\\item ...",
//   "adonsLatex": "Your LaTeX block for Adons Soft Tech experience...",
//   "changes":"Plain text changes made in the Summary, Technical Skills, MetLife, and Adons Soft Tech sections.",
//   "coverLetter": "Plain text cover letter.",
//   "coldEmail": "Plain text cold email.",
//   "FinalResumeLatex": "Final LaTeX code for the resume, ensuring no changes to the Nagarro work experience, and outputting LaTeX with escaped text like \\\\documentclass{resume} and \\\\end{document}...",
// }
// \`\`\`
// ===========================
// 💼 JOB DESCRIPTION:
// ===========================
// ${jobDescription}
//   `.trim();
// }

export function buildGeminiPrompt({
  jobDescription,
  resumeTemplate,
  coverLetterTemplate,
  coldEmailTemplate,
}) {
  return `
You are an expert LaTeX resume assistant specializing in ATS optimization and recruiter appeal.  
Based on the provided job description and LaTeX resume template, rewrite the resume so that the **Experience section** is weighted heavily toward the specific technologies, skills, and responsibilities found in the job description.

===========================
🧾 CONTEXT:
===========================
Original LaTeX resume template:
\`\`\`latex
${resumeTemplate}
\`\`\`

Cover letter template:
\`\`\`
${coverLetterTemplate}
\`\`\`

Cold outreach email template:
\`\`\`
${coldEmailTemplate}
\`\`\`

===========================
📌 JD-WEIGHTED OPTIMIZATION RULES:
===========================
1. **Single-Page Constraint**
   - The final LaTeX resume **MUST** fit on a single, standard A4 or US Letter page.
   - Achieve this by being extremely concise, prioritizing only the most relevant information, and aggressively trimming verbose or less-important details.
   - Use all available space on the page efficiently, but do not make the document unreadable by using an excessively small font size.
2. **Keyword Prioritization**
   - Extract the most critical keywords from the job description (technical skills, tools, responsibilities, soft skills).
   - Prioritize them in this order:  
     1. Experience bullets  
     2. Summary section  
     3. Technical Skills section  
   - Ensure these keywords appear in multiple resume sections for ATS reinforcement.
3. **ATS-Friendly Structure**
   - Use standard section headers: "Professional Summary", "Technical Skills", "Professional Experience", "Education".
   - Format dates as "Month YYYY".
   - Include graduation dates in Education.
4. **Bullet Point Format**
  - Use Google's XYZ formula: "Accomplished [X] by doing [Y] using [Z]".
   - Keep bullets as concise as possible, Make sure the bullet points fills the complete two lines. Each bullet point Should have maximum of 30 words, It should not just end up in the middle or starting of the second line, ideally 2-3 lines long (absolute maximum of 3 lines).
   - When creating bullet points, structure sentences to ensure line breaks are aesthetically pleasing. Avoid having a single word wrap to a new line.
   - Rephrase bullets if necessary to achieve a more balanced line ending.
   - Vary action verbs (Led, Engineered, Implemented, Optimized, Automated, Orchestrated, Designed, Delivered, Streamlined). Make sure all the bullet points that you give do not repeat any of these action verbs.
   - Quantify results with metrics in **bold** using LaTeX (e.g., \\\\textbf{20\\%}).
   
5. **Summary**
   - Tailor to emphasize JD-required skills and responsibilities.
   - Mention role title from JD (e.g., “Front End Web Developer”) if applicable.
  - Keep bullets as concise as possible, Make sure the bullet points fills the complete two lines , It should not just end up in the middle or starting of the second line, ideally 2-3 lines long (absolute maximum of 3 lines).
-Each bullet point should have a maximum of 30 words.

6. **Experience Sections (MetLife & Adons Soft Tech)**:
   - **JD Mapping Priority**: For each role, extract the top 5 most critical technical skills and responsibilities from the job description. These MUST appear in the first 3-4 bullets for that role.
   - **Technology Integration**: If the JD mentions specific frameworks, tools, or methodologies not currently in your experience, weave them into relevant bullets by connecting them to similar work you've done.
   - **Relevance Scoring**: Each bullet point must score 7/10 or higher for JD relevance. If it's below 7/10, either rewrite it to be more relevant or remove it entirely.
   - **Two-Line Optimization**: Structure each bullet to fill exactly 2 full lines. Target 25-30 words per bullet, ensuring the second line has at least 8-10 words (never just 1-3 words hanging).
   - **Context Bridging**: When adapting your actual experience to match JD requirements, use phrases like "leveraged [your actual tech] to achieve [JD outcome]" or "implemented [JD methodology] using [your tools]."
   - **Quantifiable Impact**: Every bullet should include a metric that relates to business value mentioned in the JD (performance, user experience, efficiency, scalability).
   - Limit to 5-6 bullets per role, prioritizing JD alignment over comprehensive experience listing.

7. **Balanced Role Representation**
   - Maintain accuracy of your background but shift emphasis toward skills relevant to the target JD.
   - Keep backend and other skills for completeness, but do not let them overshadow JD-priority skills.

8. **Technical Skills**
   - **JD-First Ordering**: List skills in this exact priority:
     1. Technologies explicitly mentioned in JD requirements
     2. Technologies mentioned in JD preferred qualifications  
     3. Related/complementary technologies from your background
     4. Additional relevant skills (only if space permits)
   - **Category Restructuring**: Instead of generic categories (Frontend, Backend), use JD-aligned categories like "Core Technologies," "Development Tools," "Frameworks & Libraries," etc.
   - **Space Management**: If skills overflow the page, ruthlessly cut anything not mentioned in or directly supportive of the JD requirements.
   - Use LaTeX tabular format with proper line breaking (\\) to prevent overflow.

9. **LaTeX Line-Wrapping Optimization**
   - Given the tight margins of the provided resume template, the total line length for bullet points is limited.
   - **Crucially, avoid sentences that exceed approximately 15-20 words per line.** Rephrase longer sentences to be more concise.
   - **Two-Line Target**: Each bullet point should utilize exactly 2 lines of text. If a bullet is only 1.2 lines, add relevant detail. If it's 2.8 lines, trim excess words.
   - **Second Line Minimum**: The second line must contain at least 8-10 words to create visual balance and maximize content utilization.
   - **NEVER allow a sentence to end with only one or two words on the second line.** If this occurs, rewrite the sentence to shift at least three or four words onto that final line, ensuring a balanced visual appearance.
   - **Example of poor wrapping:**
  \`\`\`
  ...improving processing speed by
  **45%**
  \`\`\`
- **Example of good wrapping:**
  \`\`\`
  ...improving processing speed and
  reducing latency by **45%**
  \`\`\`
   
   - Achieve this by a) shortening the sentence, or b) rephrasing it to distribute words more evenly.
  10. **JD Keyword Integration Strategy**
   - **Semantic Matching**: Don't just stuff keywords. Use them in context that demonstrates actual application.
   - **Skill Translation**: Map your actual experience to JD language (e.g., if JD says "responsive design" and you have "mobile optimization," use "responsive design" in your bullets).
   - **Missing Skill Handling**: If JD requires a technology you haven't used professionally, integrate it as "gained exposure to [technology] through [relevant project/learning context]."


===========================
💼 UPDATE INSTRUCTIONS:
===========================

2. **Professional Summary**:
   - Keep the first bullet from the original resume.
   - Replace remaining bullets with concise, keyword-rich statements matching the JD and covering missing functional points (collaboration, documentation, testing).
-Each bullet point should have a maximum of 30 words.
3. Rewrite **MetLife** and **Adons Soft Tech** experiences to surface JD-relevant duties and technologies first.
4. Ensure JD-critical keywords appear in **Experience, Summary, and Skills**.
5. Keep Nagarro and Internships unchanged unless they contain JD-relevant experiences.
6. Provide a concise "changes" summary.
7. Rewrite cover letter & cold email to align with the JD.
8. Output final LaTeX resume with double escapes (\\\\) and escaped apostrophes (\\\\textquotesingle{}).
9. **Action Verb Variety Rule**
   - Track usage of action verbs in all bullet points.
   - Do not use the same verb more than twice across the entire resume.
   - If a verb like "Developed" is used more than twice, replace the rest with synonyms appropriate for the context:
     - Developed → Built, Engineered, Created, Designed, Produced, Constructed, Delivered, Formulated, Launched, Innovated.
   - Ensure the first word of each bullet is a strong action verb and avoid starting consecutive bullets with the same verb.

===========================
📝 OUTPUT FORMAT:
===========================
Respond ONLY with valid JSON in this EXACT format:

\`\`\`json
{
  "companyName": "Company Name",
  "summaryLatex": "ONLY the \\\\item content for Professional Summary - do NOT include \\\\begin{itemize} or \\\\end{itemize}. Format: \\\\item First summary point...\\    \\\\item Second summary point...",
  "skillsLatex": "ONLY the table rows for Technical Skills - do NOT include \\\\begin{tabular} or \\\\end{tabular}. Format: Languages & Java, Python \\\\\\\\ Frameworks & Spring Boot, React \\\\\\\\",
  "metlifeLatex": "ONLY the \\\\item content for MetLife experience - do NOT include job title, company, dates, or \\\\begin{itemize}/\\\\end{itemize}. Format: \\\\item First bullet point...\\    \\\\item Second bullet point...",
  "adonsLatex": "ONLY the \\\\item content for Adons experience - do NOT include job title, company, dates, or \\\\begin{itemize}/\\\\end{itemize}. Format: \\\\item First bullet point...\\    \\\\item Second bullet point...",
  "changes": "Plain text summary of changes.",
  "coverLetter": "Full cover letter text...",
  "coldEmail": "Full cold email text...",
  "FinalResumeLatex": "Complete LaTeX document with escaped text like \\\\\\\\documentclass{resume}..."
}
\`\`\`

CRITICAL FORMATTING RULES:
- For summaryLatex: Return ONLY \\\\item statements, separated by \\
- For skillsLatex: Return ONLY table rows ending with \\\\\\\\, separated by \\ 
- For metlifeLatex: Return ONLY \\\\item statements, separated by \\
- For adonsLatex: Return ONLY \\\\item statements, separated by \\
- Do NOT include any LaTeX environment wrappers like \\\\begin{itemize}, \\\\end{itemize}, \\\\begin{tabular}, \\\\end{tabular}
- Do NOT include job titles, company names, or dates in the experience fields

===========================
💼 JOB DESCRIPTION:
===========================
${jobDescription}
  `.trim();
}
// ✅ resumeTemplate.js
export const resumeTemplate = {
  full: `
\\documentclass{resume}
\\usepackage{hyperref}
\\urlstyle{same}
\\usepackage[left=0.3in,top=0.2in,right=0.3in,bottom=0.2in]{geometry}
\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}
\\renewcommand{\\namesize}{\\large}


\\name{\\textbf{Mahaboob Pasha Mohammad}}
\\address{Software Engineer \\textbar{} \\href{https://miabu-pashh.github.io/Portfolio-maibu/}{Website}
\\textbar{} \\href{https://digiresume.netlify.app/}{Digital Resume}}
\\address{Bryan, TX \\textbar{} +1 (314) 305 6056 \\textbar{}\\href{mailto:mahaboobpashamohammad8@gmail.com}{mahaboobpashamohammad8@gmail.com} \\textbar{} \\href{https://www.linkedin.com/in/mohammad-mahaboob-pasha/}{LinkedIn}}

\\usepackage{graphicx}
\\usepackage{enumitem} 

\\begin{document}
\\vspace{-1em}
\\begin{rSection}{Professional Summary}
\\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
\\item Software Engineer and Research Graduate with \\textbf{4+} years of full-stack development experience across Banking, HealthCare, and eCommerce sectors, combining hands-on expertise in React frontend development with research contributions in data structures & algorithms, payment systems, chatbot technologies, and machine design optimization.

\\end{itemize}
\\end{rSection}
\\vspace{-0.8em}
\\begin{rSection}{Technical Skills}
\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{2ex}} p{0.75\\textwidth} }
Languages & Core \\& Advanced Java, Java 8/11, Python, C, C++, Golang, SQL \\\\
Methodologies \\& OS & SDLC, Agile, Waterfall, Requirements Gathering, Linux, Windows, MacOS \\\\
Frameworks \\& IDEs & SpringBoot, Microservices, Hibernate, JPA, JSF, React.JS, Vue.JS, Node.JS. \\\\
Web Technologies & HTML, CSS, JavaScript, TypeScript, Next.js, Bootstrap, jQuery, Ajax, JSON, XML \\\\
Cloud/Application Servers & AWS (VPC, EC2, S3, ELB), Azure, Tomcat, Docker \\\\
Version Control \\& Tools & Git, GitHub, Maven, Gradle, Jira, Jenkins, CI/CD \\\\
Databases \\& J2EE & MySQL, PostgreSQL, MongoDB, Oracle DB (exposure), Servlets, JSP \\\\
\\end{tabular}
\\end{rSection}

\\vspace{-0.8em}
\\begin{rSection}{Professional Experience}

\\textbf{Software Engineer} \\textbar MetLife \\textbar Missouri, USA \\hfill \\textbf{Aug 2024 -- March 2025}
\\vspace{-0.5em}
\\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
    \\item Implemented Agile methodologies, boosting team productivity by \\textbf{15\\%} and accelerating project delivery by \\textbf{20\\%}.
    \\item Engineered high-performance applications using Core Java, Spring Boot, and Microservices, improving scalability by \\textbf{30\\%} and reducing downtime by \\textbf{20\\%}.
    \\item Developed responsive front-end interfaces using React.js, Angular, HTML, CSS, and JavaScript, achieving \\textbf{98\\%} cross-browser compatibility. Deployed AWS-based applications, reducing infrastructure costs by \\textbf{20\\%}.
\\end{itemize}

\\vspace{-0.5em}

\\textbf{Software Engineer} \\textbar Nagarro Software Limited \\textbar India \\hfill \\textbf{Aug 2021 -- Dec 2022}
\\vspace{-0.5em}
\\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
    \\item Banking, Financial Services, and Insurance (BFSI) : lead for this team and Implemented REST APIs for seamless communication between front-end (React) and back-end (Java) for Realtime chat communication for banking domain
website to reduce the confusion among new customers visiting the website, improving app efficiency by \\textbf{75\\%}.
    \\item Mendix Development : Collaborated on Siemens web portal using Mendix and Java, achieving a \\textbf{80\\%} reduction in development time and streamlined backend enhancements.
\\end{itemize}

\\vspace{-0.5em}
\\textbf{Software Engineer} \\textbar Adons Soft Tech \\textbar India \\hfill \\textbf{Jan 2020 -- Aug 2021}
\\vspace{-0.5em}
\\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
    \\item Led waterfall project workflows, achieving \\textbf{100\\%} on-time delivery and maintaining clear phase-gate reviews.
    \\item Developed high-performance backend systems using Core Java, Servlets, JSP, and JDBC, improving processing speed by \\textbf{45\\%}.
    \\item Designed responsive UIs using HTML, CSS, Bootstrap, and JavaScript, enhancing user experience and increasing traffic by \\textbf{20\\%}.
\\end{itemize}
\\end{rSection}

\\vspace{-0.8em}
\\begin{rSection}{Education}
\\textbf{Master of Science in Computer Software Engineering} \\textbar{} Saint Louis University \\hfill \\textbf{Jan 2023 -- Dec 2024}\\\\
\\vspace{-1em}\\\\
\\textbf{Bachelor of Technology in Mechanical Engineering}\\textbar{} Griet, \\textit{India}  \\hfill \\textbf{Aug 2017 -- Jul 2021}
\\end{rSection}
\\end{document}
`,
};

// commented code for acivements and startup experience

// \\vspace{-0.5em}
// \\textbf{Co-Founder \\& Engineer} \\textbar{} Nithya Industries (Startup) \\textbar{} India \\hfill \\textbf{May 2021 -- Jan 2024}
// \\vspace{-0.5em}
// \\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
//     \\item Spearheaded product design and marketing initiatives, launching \\textbf{5+} technical catalogues and campaigns, increasing retention by \\textbf{30\\%} and attracting clients from \\textbf{3+} countries.
// \\end{itemize}

// \\end{rSection}

// \\vspace{-0.8em}
// \\begin{rSection}{Achievements}
// \\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
//     \\item Developed MVPs and POCs for \\textbf{5+} innovative software tools; ongoing research in scalable product solutions.
//     \\item National Champions, Mega ATV Championship 2021.
// \\end{itemize}
// \\end{rSection}
// / coverLetterTemplate.js

//internhsips section to be added later

// \\textbf{Internships} \\textbar\ \\href{https://gamesforlove.org/} {Games For Love} \\textbar\\ \\href{https://www.missouribotanicalgarden.org/media/fact-pages/botanical-heights} {BHNA} \\textbar\  \\href{https://www.itsyourbirthdayinc.org/} {It’s Your Birthday} \\textbar\\ Saint Louis, MO\\hfill \\textbf{Jun 2023 - Dec 2024}
//  \\vspace{-0.5em}
// \\begin{itemize}[leftmargin=*, itemsep=-0.5em, topsep=0em]
// \\itemsep -18pt {}
// \\item \\textbf{Games for love}: Designed and developed a game aimed at enhancing cognitive abilities by \\textbf{15\\%}, optimizing players' reaction times for improved performance. \\textbf{Tech stack}: C\\#, Html, Css, Machine learning.\\\\
// \\item \\textbf{Botanical Heights Neighbourhood Association}: Led the development of a customer sentiment analysis tool leveraging natural language processing, achieving a \\textbf{20\\%} improvement in prediction accuracy through advanced model optimization techniques.
// \\textbf{Tech stack}: Python, Scikit-learn, Pandas, Seaborn\\\\
// \\item \\textbf{It's Your Birthday}:
// Developed a machine learning model to predict event participation trends with an accuracy of \\textbf{85\\%}, enabling data-driven decision-making.\\textbf{Tech stack}: Python, Matplotlib, Pandas, PostgreSQL\\\\
// \\end{itemize}
// \\vspace{-1.5em}

export const coverLetterTemplate = `
I am excited to apply for the [Position] opportunity at [Company Name], as advertised. With over four years of hands-on experience in full-stack software development and a Master’s degree in Software Engineering from Saint Louis University, I am eager to contribute to your team by delivering innovative solutions that enhance system performance and user satisfaction.

Your organization’s focus on [type of work the company does] aligns closely with my professional interests and passion for developing scalable, efficient, and user-friendly applications.

In my previous role at MetLife, I led Agile teams to develop high-availability backend systems using Core Java, Spring Boot, and Microservices, achieving a 30% improvement in scalability. My expertise in front-end development with React.js and Angular, combined with efficient AWS deployments, resulted in a 20% reduction in operational costs.

At Nagarro, I implemented real-time chat systems in the BFSI domain and developed rapid low-code applications using Mendix. At Adons Soft Tech, I accelerated backend processing by 45% through Java-based solutions and improved user experience with responsive UI design.

With a Master’s degree in Software Engineering and a proven track record of delivering impactful software solutions, I am confident in my ability to contribute meaningfully to [Company Name]’s innovative projects. My portfolio showcases several projects that highlight my technical expertise and problem-solving skills.

Thank you for considering my application. I’ve attached my resume for your review and would welcome the opportunity to discuss how I can support your team. I can be reached at +1 (314)-305-6056 or via email at mahaboobpashamohammad8@gmail.com.

Warm regards,  
Mahaboob Pasha Mohammad  
LinkedIn: https://www.linkedin.com/in/mohammad-mahaboob-pasha/  
Portfolio: https://miabu-pashh.github.io/Portfolio-maibu/  
GitHub: https://github.com/miabu-pashh

Schedule a Zoom call: https://calendly.com/mahaboobpashamohammad8/30min
`;

// coldEmailTemplate.js
export const coldEmailTemplate = `
Subject: Experienced Java Full-Stack Engineer – Open to Opportunities

Hi [Hiring Manager’s Name],

I hope you're doing well. My name is Mahaboob Pasha Mohammad, and I’m a Software Engineer with over 4 years of experience in Java Full Stack Development. I recently completed my Master’s in Software Engineering at Saint Louis University and have built scalable backend systems and responsive frontend apps across BFSI, Healthcare, and eCommerce domains.

I’m reaching out to explore any potential opportunities at [Company Name] where my background in Core Java, Spring Boot, Microservices, and React/Angular could add value. I’ve attached my resume and cover letter for your reference and would welcome a brief chat if you're open to connecting.

Thank you for your time and consideration.

Best regards,  
Mahaboob Pasha Mohammad  
mahaboobpashamohammad8@gmail.com | (314) 305-6056  
LinkedIn: https://www.linkedin.com/in/mohammad-mahaboob-pasha/  
Portfolio: https://miabu-pashh.github.io/Portfolio-maibu/  
GitHub: https://github.com/miabu-pashh

Schedule a Zoom call: https://calendly.com/mahaboobpashamohammad8/30min
`;

export const referralEmailTemplate = `
Subject: Quick Referral Request for [Job Title] Role at [Company Name]

Hi [Referral's Name],

I hope you're doing well! I came across the [Job Title] opening at [Company Name] and noticed you're connected with the team. I’m currently seeking full-time roles where I can leverage my experience in Java Full Stack development, Spring Boot, React, and AWS to build high-impact applications.

Would you be open to referring me or pointing me in the right direction? I’ve attached my resume for your reference, and I’d be happy to provide a tailored message if needed.

Thanks so much for your time and support!

Warm regards,  
Mahaboob Pasha Mohammad  
mahaboobpashamohammad8@gmail.com | (314) 305-6056  
LinkedIn: https://www.linkedin.com/in/mohammad-mahaboob-pasha/  
Portfolio: https://miabu-pashh.github.io/Portfolio-maibu/

Schedule a Zoom call: https://calendly.com/mahaboobpashamohammad8/30min
`;

export const jobApplicationEmailTemplate = `
Subject: Application for [Job Title] – Mahaboob Pasha Mohammad

Dear [Hiring Manager's Name],

I am excited to apply for the [Job Title] position at [Company Name]. With over 4 years of experience as a Software Engineer specializing in Java Full Stack development, along with a Master’s degree from Saint Louis University, I am confident in my ability to contribute effectively to your team.

Please find my resume and cover letter attached for your review. I would welcome the opportunity to speak further about how my experience aligns with your current needs.

Thank you for your time and consideration.

Best regards,  
Mahaboob Pasha Mohammad  
mahaboobpashamohammad8@gmail.com | (314) 305-6056  
LinkedIn: https://www.linkedin.com/in/mohammad-mahaboob-pasha/  
Portfolio: https://miabu-pashh.github.io/Portfolio-maibu/  
GitHub: https://github.com/miabu-pashh

Schedule a Zoom call: https://calendly.com/mahaboobpashamohammad8/30min
`;

export function buildATSAnalysisPrompt({ jobDescription, resumeTemplate }) {
  // console.log(
  //   "🚀 In the build prompt file , buildATSAnalysisPrompt called with:"
  // );
  return `
You're an ATS (Applicant Tracking System) expert. Your job is to compare the job description and resume and return an analysis in structured JSON format.
  
 ============================
📄 RESUME (LaTeX Format):
============================
This is the original LaTeX resume template:
\`\`\`latex
${resumeTemplate}
\`\`\`
  ============================
  📌 JOB DESCRIPTION
  ============================
  ${jobDescription}
  ============================
  ============================
  📌 YOUR TASK:
  ============================
  Based on the job description below:
  1.Analyze the resume given to you here in the latex form,  and compare it against the job description.
  2.Identify the missing keywords, underrepresneted skills, or mismatched experience.
  3.Estimate a typical ATS (Applicant Tracking System ) score (out of 100)
  4.Suggest specific improvements to help better align the resume with job description.
  5.Provide a summary of the analysis and recommendations in a clear and concise manner.
  ============================
  ===========================
📝 OUTPUT FORMAT:
===========================
Respond ONLY with valid JSON in the following format:

\`\`\`json
{
  "atsScore": 75,
  "gaps": [
    "Years of experience is 4+, but JD requires 6.",
    "NGINX is not mentioned.",
    "Swagger missing from resume.",
    "Retail domain not highlighted."
  ],
  "improvements": [
    "Add NGINX to Web Technologies.",
    "Mention Swagger (OpenAPI) with REST APIs.",
    "Highlight any retail/eCommerce domain exposure.",
    "Include Docker/Kubernetes for containerization."
  ],
  "summary": "The resume has a strong foundation in Java full-stack development, but lacks domain-specific keywords and some tools. By addressing these gaps, the ATS match can significantly improve."
}
\`\`\`
`.trim();
}

export function buildGeminiPromptForJD({ jobDescription, resumeTemplate }) {
  return `
You are an expert in analyzing job descriptions and determining resume compatibility. Based on the job description and LaTeX resume, follow the checklist below and return a JSON object.

============================
📄 RESUME (LaTeX Format):
============================
${resumeTemplate}

============================
📌 JOB DESCRIPTION:
============================
${jobDescription}

============================
✅ YOUR TASK:
============================
1. Identify skills, tools, and qualifications mentioned in the job description.
2. Check if the resume contains most of those skills.
3. Flag if the JD requires >5 years experience and the resume doesn't match.
4. Flag any eligibility blockers like needing US citizenship or disallowing OPT/CPT.
5. Suggest improvements to the resume if needed.
6. Conclude if the user should apply or not.

============================
📝 OUTPUT FORMAT:
============================
Respond ONLY with valid JSON in the following format:

{
  "result": "Your explanation and advice here as plain text."
}

Do NOT include markdown or commentary outside the JSON.
`.trim();
}

// On 05/23/2025 Friday

export function buildLinkedInMessagePrompt({ jobDescription, resumeTemplate }) {
  // console.log("🚀 buildLinkedInMessagePrompt called with:");
  return `
You are an expert in writing short, professional messages to recruiters on LinkedIn.

============================
📄 RESUME (LaTeX Format):
============================
This is the original LaTeX resume template:
\`\`\`latex
${resumeTemplate}
\`\`\`

============================
📌 JOB DESCRIPTION:
============================
${jobDescription}

============================
✅ YOUR TASK:
============================
Write a **short LinkedIn message (under 300 characters)** that:
1. Expresses interest in the job.
2. Highlights 1–2 relevant strengths from the resume.
3. Is polite and professional.
4. Avoids buzzwords, fluff, or excessive detail.
5. Sounds natural and human—not robotic.
6. Makes the reader want to connect or respond.

============================
📝 OUTPUT FORMAT:
============================
Respond ONLY with valid JSON:
{
  "linkedinMessage": "Your 1-line message here"
}
`.trim();
}
export function buildCoverLetterUpdatePrompt({
  jobDescription,
  resumeTemplate,
  coverLetterTemplate,
  todayDate,
}) {
  return `
You are an expert job application assistant.

============================
📄 RESUME (LaTeX Format):
============================
\`\`\`latex
${resumeTemplate}
\`\`\`

============================
📌 JOB DESCRIPTION:
============================
${jobDescription}

============================
✉️ COVER LETTER TEMPLATE:
============================
\`\`\`
${coverLetterTemplate}
\`\`\`

============================
✅ YOUR TASK:
============================
Update the cover letter using the resume and job description.

- Insert this exact date: **${todayDate}** where applicable.
- Extract the company name and address from the job description and include it under the date.
- Highlight any changed or inserted content using double asterisks (e.g., **React**, **problem-solving**, etc.).
- Do not remove existing content. Retain original structure and tone.
- Return only the updated plain text cover letter.
`.trim();
}

//developed on 06/15/2025 Sunday
export const buildCompanyAndEmailPrompt = (jobDescription) => `
You are an AI assistant that helps job seekers.

Given the job description below, extract:

1. The Company Name
2. A careers, HR, or recruiter email address (e.g., hr@company.com, careers@company.com, etc.)

If the email is not available, return "Not available".

Respond strictly in this format:
Company Name: <company name>
Email: <hr or careers email>

Job Description:
""" 
${jobDescription}
"""
`;

//added on 08/30/2025 Saturday

// export function buildFitForRolePrompt({ jobDescription, resumeLatex }) {
//   return `
// You are an intelligent assistant helping job seekers explain why they are a strong fit for a specific job.

// Your task is to compare the job description against the candidate's background (including their full profile and LaTeX resume). Do NOT write a cover letter. Instead, write a plain-text explanation that shows how the candidate’s skills, projects, and experience align with the job requirements.

// Use this reasoning format for each paragraph:
// "The job requires ___; the candidate has ___ from ___."

// Avoid marketing language. Just stick to logical, evidence-based comparisons.

// ---
// 🔹 Candidate Profile:
// Mahaboob Pasha Mohammad is a full-stack Software Engineer with 4+ years of experience across backend (Java, Spring Boot, Node.js), frontend (React, Angular), and AI automation tools. He has built production systems, resume automation tools, and intelligent classifiers. He holds a Master's degree in Software Engineering from Saint Louis University with a 3.92 GPA. Below is a summary of his professional background:

// **Work Experience:**
// - **MetLife**: Built Java + Spring Boot backend services and enterprise apps (2024–2025)
// - **Nagarro**: Java + Angular development for BFSI chatbot and Mendix platforms (2021–2022)
// - **Adons Soft Tech**: Java + JSP/Servlets + database systems, used AWS and CI/CD (2020–2021)
// - **SLU Open Source**: Node.js tools, full-stack features (2024)
// - **Internships**: Web, NLP, and analytics-focused work (React, Python, MongoDB)

// **Projects:**
// - **ResumeMe** – React + Node + Gemini API-based resume tailoring and AI cover letter generator
// - **LaTeXForge** – Document automation engine using LaTeX and real-time Gemini output
// - **Gmail Classifier** – NLP-powered Gmail job mail sorter with React UI and backend cache
// - **Clipboard Sync** – Real-time AES-encrypted sync tool across devices (React Native, Node.js)
// - **Digi Resume** – Swipeable interactive resume viewer (React + Vite)

// **Certifications & Education:**
// - AWS Cloud Practitioner, SQL/Java (HackerRank), HTML/CSS/JS (Udemy)
// - M.S. in Software Engineering (Saint Louis University), B.Tech in Mechanical Engineering (Griet)

// **Technical Skills:**
// - Java, Spring Boot, Node.js, React, Angular, MongoDB, Prisma, PostgreSQL, LaTeX
// - Gemini API, NLP, WebSockets, RESTful APIs, AWS EC2/S3, Docker, GitHub Actions, Vite

// ---
// 📄 LaTeX Resume:
// ${resumeLatex}

// ---
// 💼 Job Description:
// ${jobDescription}
//   `.trim();
// }
export function buildFitForRolePrompt({ jobDescription, resumeLatex }) {
  return `
============================
💼 JOB DESCRIPTION:
============================
${jobDescription}

============================
🧑‍💼 CANDIDATE PROFILE:
============================

Mahaboob Pasha Mohammad is a full-stack Software Engineer with 4+ years of experience across backend (Java, Spring Boot, Node.js), frontend (React, Angular), and AI automation tools. He has built production systems, resume automation tools, and intelligent classifiers. He holds a Master's degree in Software Engineering from Saint Louis University with a 3.92 GPA.

**Work Experience:**
- **MetLife**: Built Java + Spring Boot backend services and enterprise apps (2024–2025)
- **Nagarro**: Java + Angular development for BFSI chatbot and Mendix platforms (2021–2022)
- **Adons Soft Tech**: Java + JSP/Servlets + database systems, used AWS and CI/CD (2020–2021)
- **SLU Open Source**: Node.js tools, full-stack features (2024)
- **Internships**: Web, NLP, and analytics-focused work (React, Python, MongoDB)

**Projects:**
- **ResumeMe** – React + Node + Gemini API-based resume tailoring and AI cover letter generator
- **LaTeXForge** – Document automation engine using LaTeX and real-time Gemini output
- **Gmail Classifier** – NLP-powered Gmail job mail sorter with React UI and backend cache
- **Clipboard Sync** – Real-time AES-encrypted sync tool across devices (React Native, Node.js)
- **Digi Resume** – Swipeable interactive resume viewer (React + Vite)

**Certifications & Education:**
- AWS Cloud Practitioner, SQL/Java (HackerRank), HTML/CSS/JS (Udemy)
- M.S. in Software Engineering (Saint Louis University), B.Tech in Mechanical Engineering (Griet)

**Technical Skills:**
- Java, Spring Boot, Node.js, React, Angular, MongoDB, Prisma, PostgreSQL, LaTeX
- Gemini API, NLP, WebSockets, RESTful APIs, AWS EC2/S3, Docker, GitHub Actions, Vite

============================
📄 LATEX RESUME:
============================
${resumeLatex}

============================
🎯 INSTRUCTIONS:
============================

Your task is to determine why this candidate is a good match for the job. Return **only the two following sections**:

---

🔹 SECTION 1: MATCHED REQUIREMENTS

Return 4–6 rows, one per requirement in **first person**, from the candidate's point of view.

Each row must be structured in this format (exactly):

**Requirement:** <short requirement phrase>  
**Experience:** <1–2 sentences matching experience>

Leave a blank line between each row. Do not include bullet points or extra formatting.

---

🔹 SECTION 2: SUMMARY PARAGRAPH

Write 3–5 sentences in **first person**, from the candidate's point of view.

Reference actual company/project names (e.g. MetLife, ResumeMe) and technologies (e.g. Spring Boot, AWS, Gemini API).

❌ Avoid: "I am passionate about", "I believe I would be a great fit", or any praise language.  
✅ Focus on: “I built...”, “I developed...”, “I deployed...”

DO NOT write headings. DO NOT repeat these instructions. DO NOT use bullet points.
`.trim();
}
