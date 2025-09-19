export const resumeTemplate = {
  full: `
\\documentclass{resume}
\\usepackage{hyperref}
\\urlstyle{same}
\\usepackage[left=0.3in,top=0.2in,right=0.3in,bottom=0.2in]{geometry}
\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}
\\renewcommand{\\namesize}{\\large}  % or \\normalsize, \\small
% Redefine \\rSection to prevent automatic capitalization
% \\makeatletter
% \\renewcommand{\\rSection}[1]{\\sectionskip \\noindent{\\bf #1} \\sectionlineskip \\hrule \\sectionskip}
% \\makeatother

\\name{ \\textbf{Mahaboob Pasha Mohammad}}
\\address{Software Engineer \\\\ \\href{https://miabu-pashh.github.io/Portfolio-maibu/}{Website}}
\\address{Saint Louis, MO \\\\ +1 (314) 305 6056 \\\\ \\href{mailto:mahaboobpashamohammad1@gmail.com}{mahaboobpashamohammad1@gmail.com} \\\\ \\href{https://www.linkedin.com/in/mohammad-mahaboob-pasha-19ba58183/}{linkedIn}}

\\usepackage{graphicx}
\\usepackage{enumitem} % Add this in your preamble if not already included

\\begin{document}
 \\vspace{-1em} % Reduce space above
\\begin{rSection}{Summary}
\\begin{itemize}[leftmargin=*]
    \\item Software Engineer with expertise in Banking, HealthCare, and eCommerce sectors using Java Full Stack Development (React/Angular) with 4+ years of experience delivering robust and scalable software solutions.
\\end{itemize}
\\end{rSection}
 \\vspace{-0.8em} % Reduce space above
\\begin{rSection}{Technical Skills}
\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{2ex}} l }
Languages & Core \\& Advanced Java, Java 8/11, Python, C Language.\\\\
Methodologies \\& OS & SDLC, Agile, Waterfall, Windows, Linux, Mac.\\\\
Frameworks \\& IDEs & Spring (MVC, Boot, Security), Microservices, Hibernate,React.JS\\\\
Web Technologies & HTML, CSS, JavaScript, TypeScript, NextJs, Bootstrap, jQuery, Ajax, JSON, XML\\\\
Cloud/Application Server & AWS (VPC, EC2, S3, CloudFront, ELB), Azure, Apache Tomcat, IBM Web Sphere\\\\
Version Control/Other Tools & Git, GitHub, GitLab, Maven, Gradle, Jira, Jenkins, Junit, Excel, JMeter\\\\
Database \\& J2EE Technologies & MySQL, PostgreSQL, MongoDB, Servlets, JSP, JSTL, JavaBeans, JDBC\\\\
\\end{tabular}
\\end{rSection}
 \\vspace{-0.8em} % Reduce space above

\\begin{rSection}{Experience}

\\textbf{Software Engineer} \\textbar  {MetLife} \\textbar { Missouri, USA} \\hfill  \\textbf {Aug 2024 - Present}
\\begin{itemize}[leftmargin=*]
    \\itemsep -6pt {}
     \\vspace{-0.5em} % Reduce space above
    \\item Implemented Agile methodologies, boosting team productivity by \\textbf{15\\%} and accelerating project delivery timelines by \\textbf{20\\%} through enhanced collaboration and iterative development cycles. \\\\
\\vspace{-1.1em}
\\item Designed and Engineered high-performance web applications using Core Java, Spring Boot, and Microservices,
enhancing scalability by \\textbf{30\\%} and minimizing downtime by \\textbf{20\\%} \\\\
\\vspace{-1.1em}
\\item Developed a responsive front-end interfaces with React.js, Angular, HTML, CSS, and JavaScript, achieving \\textbf{98\\%} cross-
browser compatibility. Deployed AWS-based applications (EC2, S3, VPC, ELB), cutting infrastructure costs by \\textbf{20\\%}.\\\\
\\end{itemize}
 \\vspace{-1.3 em} % Reduce space above

\\textbf{Software Engineer (Java)} \\textbar  {Nagarro Software Limited} \\textbar { India} \\hfill  \\textbf {Aug 2021 - Dec 2022}
\\begin{itemize}[leftmargin=*]
    \\itemsep -6pt {}
     \\vspace{-0.5em} % Reduce space above
    \\item \\textbf {Banking, Financial Services, and Insurance (BFSI)} lead for this team and Implemented REST APIs for seamless communication between front-end (React) and back-end (Java) for Realtime chat communication for banking domain
website to reduce the confusion among new customers visiting the website, improving app efficiency by \\textbf {75\\%}. \\\\
\\vspace{-1.1em}
\\item \\textbf {Mendix Development}: Collaborated with cross-functional teams to deliver an web portal solution for SIEMENS,
utilizing Mendix for rapid prototyping and Java for backend feature enhancements, resulting in a \\textbf {80\\%} reduction in
development time. \\\\
\\end{itemize}
 \\vspace{-1.3 em} % Reduce space above

\\textbf{Software Engineer} \\textbar  {Adons Soft Tech} \\textbar { India} \\hfill  \\textbf {Jan 2020 - Aug 2021}
\\begin{itemize}[leftmargin=*]
    \\itemsep -6pt {}
     \\vspace{-0.5em} % Reduce space above
\\item Led waterfall project workflows across main projects achieving  \\textbf {100\\%} on-time delivery and maintaining clear phase gate reviews to ensure project alignment and risk mitigation.\\\\
\\vspace{-1.1em}
\\item Industrialized high-performance backend solutions using Core Java, Servlets, JSP, and JDBC, improving application
processing speed by \\textbf {45\\%}.\\\\
\\vspace{-1.1em}
\\item Designed responsive UI using HTML, CSS, Bootstrap, and JavaScript, enhancing user experience and increasing website
traffic by \\textbf {20\\%}.\\\\
\\end{itemize}

 \\vspace{-1.3 em} % Reduce space above

\\textbf{Nithya Industries (Startup)} \\textbar India \\hfill \\textbf{May 2021 - Jan 2024}
\\begin{itemize}[leftmargin=*]
    \\itemsep -3pt {}
    \\item Spearheaded Design and marketing initiatives , delivering \\textbf{5+} technical catalogues, Products and launching campaigns that boosted client retention by \\textbf{30\\%} and attracted international clients from \\textbf{3+} countries.
\\end{itemize}
\\end{rSection}
 \\vspace{-0.8em} % Reduce space above
\\begin{rSection}{ACHEIVEMENTS }
\\begin{itemize}[leftmargin=*]
    \\itemsep -6pt {}
\\item Created POC, MVP, Prototypes of tools and softwares for \\textbf{5+} Innovative Projects, Continuing Research further.\\\\
\\vspace{-1em}
\\item National Champions ATV( Mega ATV Championship) 2021.
\\end{itemize}
\\end{rSection}
\\vspace{-1em}

\\begin{rSection}{Education}
\\textbf{Master of Science in Computer Software Engineering} \\textbar{} Saint Louis University , Missouri , United States.\\\\
\\vspace{-1em}\\\\
\\textbf{Bachelors in Mechanical Engineering}\\textbar{}  Gokaraju Rangaraju Institute of Engineering and Technology, India \\\\
\\end{rSection}
\\end{document}
`,
};
