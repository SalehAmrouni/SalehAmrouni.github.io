// ============================================
// OPPORTUNITIES DATABASE
// 80+ opportunities across 5 clusters
// ============================================

const opportunitiesData = [
    // ========== STEM CLUSTER (24 opportunities) ==========
    {
        id: 1,
        title: "NASA OSTEM Internship",
        organization: "NASA",
        cluster: "STEM",
        location: "National",
        cost: "Paid",
        duration: "Summer, 8-10 weeks",
        description: "Hands-on research internship at NASA centers nationwide. Work with scientists on cutting-edge space and aeronautics research projects.",
        link: "https://intern.nasa.gov",
        eligibility: {
            minGPA: 3.5,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Research", "Physics", "Engineering"]
        },
        featured: true,
        matchScore: 100
    },
    {
        id: 2,
        title: "MIT Research Science Institute",
        organization: "MIT & CEE",
        cluster: "STEM",
        location: "Cambridge, MA",
        cost: "Free + Stipend",
        duration: "6 weeks",
        description: "Intensive summer research program at MIT for academically talented high school students. Conduct original research with MIT faculty.",
        link: "https://www.cee.org/programs/rsm",
        eligibility: {
            minGPA: 3.8,
            grades: [11],
            hoursRequired: 0,
            skills: ["STEM", "Research", "Mathematics"]
        },
        featured: true,
        matchScore: 98
    },
    {
        id: 3,
        title: "Google Computer Science Summer Institute",
        organization: "Google",
        cluster: "STEM",
        location: "Virtual",
        cost: "Free",
        duration: "3 weeks",
        description: "Introduction to computer science for rising college freshmen. Learn programming fundamentals directly from Google engineers.",
        link: "https://buildyourfuture.withgoogle.com",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Programming", "Computer Science"]
        },
        featured: true,
        matchScore: 92
    },
    {
        id: 4,
        title: "Johns Hopkins Engineering Innovation",
        organization: "Johns Hopkins University",
        cluster: "STEM",
        location: "Multiple Sites",
        cost: "Paid",
        duration: "4 weeks",
        description: "College-level engineering course for high school students. Earn college credit upon successful completion.",
        link: "https://engineering.jhu.edu/ei",
        eligibility: {
            minGPA: 3.0,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Engineering", "Mathematics"]
        },
        matchScore: 88
    },
    {
        id: 5,
        title: "Smithsonian Science Education Center Internship",
        organization: "Smithsonian Institution",
        cluster: "STEM",
        location: "Washington, DC",
        cost: "Paid",
        duration: "8 weeks",
        description: "Work with Smithsonian scientists on science education projects and public outreach initiatives.",
        link: "https://ssec.si.edu",
        eligibility: {
            minGPA: 3.2,
            grades: [11, 12],
            hoursRequired: 20,
            skills: ["STEM", "Education", "Communication"]
        },
        matchScore: 85
    },
    {
        id: 6,
        title: "National Institutes of Health Summer Internship",
        organization: "NIH",
        cluster: "STEM",
        location: "Bethesda, MD",
        cost: "Paid",
        duration: "8 weeks",
        description: "Biomedical research experience at the world's largest medical research facility.",
        link: "https://www.training.nih.gov",
        eligibility: {
            minGPA: 3.4,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Biology", "Chemistry", "Research"]
        },
        matchScore: 90
    },
    {
        id: 7,
        title: "Microsoft High School Internship Program",
        organization: "Microsoft",
        cluster: "STEM",
        location: "Redmond, WA",
        cost: "Paid",
        duration: "Summer",
        description: "Software development and technology internship for high school students interested in computer science.",
        link: "https://careers.microsoft.com",
        eligibility: {
            minGPA: 3.3,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["Programming", "Computer Science", "Technology"]
        },
        matchScore: 87
    },
    {
        id: 8,
        title: "MITES Semester",
        organization: "MIT",
        cluster: "STEM",
        location: "Cambridge, MA",
        cost: "Free",
        duration: "6 months",
        description: "Rigorous STEM enrichment program for underrepresented and underserved students.",
        link: "https://mit.edu/mites",
        eligibility: {
            minGPA: 3.5,
            grades: [11],
            hoursRequired: 0,
            skills: ["STEM", "Mathematics", "Science"]
        },
        matchScore: 94
    },
    {
        id: 9,
        title: "Girls Who Code Summer Immersion Program",
        organization: "Girls Who Code",
        cluster: "STEM",
        location: "Virtual",
        cost: "Free",
        duration: "7 weeks",
        description: "Learn programming fundamentals and get exposure to tech jobs through this intensive virtual program.",
        link: "https://girlswhocode.com",
        eligibility: {
            minGPA: 3.0,
            grades: [10, 11],
            hoursRequired: 0,
            skills: ["Programming", "Computer Science"]
        },
        matchScore: 91
    },
    {
        id: 10,
        title: "Stanford AI4ALL",
        organization: "Stanford University",
        cluster: "STEM",
        location: "Stanford, CA",
        cost: "Free",
        duration: "3 weeks",
        description: "Introduction to artificial intelligence for 9th grade girls interested in computer science.",
        link: "https://ai4all.stanford.edu",
        eligibility: {
            minGPA: 3.5,
            grades: [9],
            hoursRequired: 0,
            skills: ["STEM", "Programming", "Mathematics"]
        },
        matchScore: 89
    },
    {
        id: 11,
        title: "CodePath.org Technical Interview Prep",
        organization: "CodePath",
        cluster: "STEM",
        location: "Virtual",
        cost: "Free",
        duration: "10 weeks",
        description: "Master technical interview skills with industry professionals. Focus on data structures and algorithms.",
        link: "https://codepath.org",
        eligibility: {
            minGPA: 3.0,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["Programming", "Computer Science"]
        },
        matchScore: 86
    },
    {
        id: 12,
        title: "MIT LaunchX Entrepreneurship Program",
        organization: "MIT",
        cluster: "STEM",
        location: "Virtual",
        cost: "Paid",
        duration: "4 weeks",
        description: "Learn entrepreneurship and launch a real startup with guidance from MIT mentors.",
        link: "https://launchx.com",
        eligibility: {
            minGPA: 3.3,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Business", "Leadership"]
        },
        matchScore: 83
    },
    {
        id: 13,
        title: "Carnegie Mellon Pre-College Programs",
        organization: "Carnegie Mellon University",
        cluster: "STEM",
        location: "Pittsburgh, PA",
        cost: "Paid",
        duration: "6 weeks",
        description: "Choose from computer science, robotics, AI, or game design intensive summer programs.",
        link: "https://admission.enrollment.cmu.edu",
        eligibility: {
            minGPA: 3.4,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Programming", "Engineering"]
        },
        matchScore: 88
    },
    {
        id: 14,
        title: "National Oceanic and Atmospheric Administration Internship",
        organization: "NOAA",
        cluster: "STEM",
        location: "Multiple Sites",
        cost: "Paid",
        duration: "8-10 weeks",
        description: "Marine science, atmospheric research, and environmental conservation internships.",
        link: "https://www.noaa.gov/education",
        eligibility: {
            minGPA: 3.2,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Science", "Environmental"]
        },
        matchScore: 85
    },
    {
        id: 15,
        title: "3M Young Scientist Challenge",
        organization: "3M & Discovery Education",
        cluster: "STEM",
        location: "National",
        cost: "Free to enter",
        duration: "Year-long",
        description: "National science competition for grades 5-8. Solve everyday problems using science.",
        link: "https://www.youngscientistlab.com",
        eligibility: {
            minGPA: 3.0,
            grades: [5, 6, 7, 8],
            hoursRequired: 0,
            skills: ["STEM", "Science", "Innovation"]
        },
        matchScore: 82
    },
    {
        id: 16,
        title: "Siemens Competition in Math, Science & Technology",
        organization: "Siemens Foundation",
        cluster: "STEM",
        location: "National",
        cost: "Free to enter",
        duration: "Academic Year",
        description: "Premier national STEM research competition for high school students.",
        link: "https://siemenscompetition.discoveryeducation.com",
        eligibility: {
            minGPA: 3.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Research", "Science"]
        },
        matchScore: 90
    },
    {
        id: 17,
        title: "NASA Space Apps Challenge",
        organization: "NASA",
        cluster: "STEM",
        location: "Global",
        cost: "Free",
        duration: "48-hour hackathon",
        description: "International hackathon where teams use NASA data to solve real-world problems.",
        link: "https://www.spaceappschallenge.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Programming", "Design"]
        },
        matchScore: 84
    },
    {
        id: 18,
        title: "MIT Beaver Works Summer Institute",
        organization: "MIT Lincoln Laboratory",
        cluster: "STEM",
        location: "Cambridge, MA",
        cost: "Free",
        duration: "4 weeks",
        description: "Project-based STEM program in autonomous systems, data science, and more.",
        link: "https://beaverworks.ll.mit.edu",
        eligibility: {
            minGPA: 3.5,
            grades: [11],
            hoursRequired: 0,
            skills: ["STEM", "Programming", "Engineering"]
        },
        matchScore: 92
    },
    {
        id: 19,
        title: "BioGENEius Challenge",
        organization: "Biotechnology Innovation Organization",
        cluster: "STEM",
        location: "National",
        cost: "Free to enter",
        duration: "Academic Year",
        description: "National biotechnology research competition for high school students.",
        link: "https://www.biotechinstitute.org",
        eligibility: {
            minGPA: 3.3,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Biology", "Research"]
        },
        matchScore: 87
    },
    {
        id: 20,
        title: "CyberPatriot National Youth Cyber Defense Competition",
        organization: "Air Force Association",
        cluster: "STEM",
        location: "National",
        cost: "Free",
        duration: "Seasonal",
        description: "National cybersecurity competition where teams defend virtual networks.",
        link: "https://www.uscyberpatriot.org",
        eligibility: {
            minGPA: 2.5,
            grades: [6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Cybersecurity", "Technology"]
        },
        matchScore: 83
    },
    {
        id: 21,
        title: "FIRST Robotics Competition",
        organization: "FIRST",
        cluster: "STEM",
        location: "Regional/National",
        cost: "Team fee",
        duration: "Seasonal",
        description: "Build industrial-sized robots to play difficult field games in alliance with other teams.",
        link: "https://www.firstinspires.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["STEM", "Engineering", "Robotics"]
        },
        matchScore: 86
    },
    {
        id: 22,
        title: "NASA Community College Aerospace Scholars",
        organization: "NASA",
        cluster: "STEM",
        location: "Virtual + On-site",
        cost: "Free",
        duration: "5 weeks",
        description: "STEM learning experience for community college students interested in NASA careers.",
        link: "https://nas.okstate.edu",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14], // College years
            hoursRequired: 0,
            skills: ["STEM", "Engineering", "Science"]
        },
        matchScore: 81
    },
    {
        id: 23,
        title: "MIT Primes USA",
        organization: "MIT",
        cluster: "STEM",
        location: "Cambridge, MA",
        cost: "Free",
        duration: "Year-round",
        description: "Year-long mentorship program for advanced high school students in mathematics.",
        link: "https://math.mit.edu/research/highschool/primes/usa",
        eligibility: {
            minGPA: 3.8,
            grades: [10, 11],
            hoursRequired: 0,
            skills: ["STEM", "Mathematics", "Research"]
        },
        matchScore: 95
    },
    {
        id: 24,
        title: "Regeneron Science Talent Search",
        organization: "Society for Science",
        cluster: "STEM",
        location: "National",
        cost: "Free to enter",
        duration: "Academic Year",
        description: "Nation's oldest and most prestigious science and mathematics competition.",
        link: "https://www.societyforscience.org/regeneron-sts",
        eligibility: {
            minGPA: 3.5,
            grades: [12],
            hoursRequired: 0,
            skills: ["STEM", "Research", "Science"]
        },
        matchScore: 93
    },

    // ========== ARTS CLUSTER (20 opportunities) ==========
    {
        id: 25,
        title: "Interlochen Arts Academy Summer Program",
        organization: "Interlochen Center for the Arts",
        cluster: "Arts",
        location: "Interlochen, MI",
        cost: "Paid",
        duration: "1-6 weeks",
        description: "Intensive summer programs in music, theatre, visual arts, creative writing, and dance.",
        link: "https://www.interlochen.org",
        eligibility: {
            minGPA: 2.5,
            grades: [6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Music", "Performance", "Creativity"]
        },
        featured: true,
        matchScore: 89
    },
    {
        id: 26,
        title: "National YoungArts Foundation",
        organization: "YoungArts",
        cluster: "Arts",
        location: "National",
        cost: "Free to apply",
        duration: "Year-round",
        description: "Identify and support the next generation of artists in visual, literary, design, and performing arts.",
        link: "https://www.youngarts.org",
        eligibility: {
            minGPA: 2.5,
            grades: [10, 11, 12, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Arts", "Performance", "Creativity"]
        },
        matchScore: 91
    },
    {
        id: 27,
        title: "Scholastic Art & Writing Awards",
        organization: "Alliance for Young Artists & Writers",
        cluster: "Arts",
        location: "National",
        cost: "Nominal fee",
        duration: "Academic Year",
        description: "Nation's longest-running, most prestigious recognition program for creative teens.",
        link: "https://www.artandwriting.org",
        eligibility: {
            minGPA: 2.0,
            grades: [7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Writing", "Creativity"]
        },
        matchScore: 85
    },
    {
        id: 28,
        title: "Berkeley Summer Youth Program in Filmmaking",
        organization: "UC Berkeley",
        cluster: "Arts",
        location: "Berkeley, CA",
        cost: "Paid",
        duration: "3 weeks",
        description: "Learn filmmaking from industry professionals. Write, shoot, and edit your own short film.",
        link: "https://artsdesign.berkeley.edu",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Film", "Storytelling"]
        },
        matchScore: 87
    },
    {
        id: 29,
        title: "RISD Pre-College Program",
        organization: "Rhode Island School of Design",
        cluster: "Arts",
        location: "Providence, RI",
        cost: "Paid",
        duration: "6 weeks",
        description: "Intensive studio-based program for high school students interested in art and design.",
        link: "https://precollege.risd.edu",
        eligibility: {
            minGPA: 2.5,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Design", "Creativity"]
        },
        matchScore: 90
    },
    {
        id: 30,
        title: "Broadway Artists Alliance",
        organization: "Broadway Artists Alliance",
        cluster: "Arts",
        location: "New York, NY",
        cost: "Paid",
        duration: "Summer intensives",
        description: "Musical theatre training with Broadway professionals for talented young performers.",
        link: "https://www.broadwayartistsalliance.org",
        eligibility: {
            minGPA: 2.5,
            grades: [8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Theatre", "Performance", "Music"]
        },
        matchScore: 88
    },
    {
        id: 31,
        title: "NYU Tisch Summer High School Program",
        organization: "NYU Tisch School of the Arts",
        cluster: "Arts",
        location: "New York, NY",
        cost: "Paid",
        duration: "4 weeks",
        description: "Study filmmaking, dramatic writing, game design, photography, or recorded music.",
        link: "https://tisch.nyu.edu",
        eligibility: {
            minGPA: 3.0,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Film", "Writing", "Design"]
        },
        matchScore: 89
    },
    {
        id: 32,
        title: "Adobe Creative Residency Community Fund",
        organization: "Adobe",
        cluster: "Arts",
        location: "Virtual",
        cost: "Grants available",
        duration: "Varies",
        description: "Funding and resources for young creatives to develop their skills and projects.",
        link: "https://www.adobe.com",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Arts", "Design", "Digital Media"]
        },
        matchScore: 84
    },
    {
        id: 33,
        title: "Kennedy Center American College Theater Festival",
        organization: "Kennedy Center",
        cluster: "Arts",
        location: "Regional/National",
        cost: "Nominal fee",
        duration: "Seasonal",
        description: "National theater program involving 18,000 students annually with scholarships and awards.",
        link: "https://www.kennedy-center.org",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Arts", "Theatre", "Performance"]
        },
        matchScore: 86
    },
    {
        id: 34,
        title: "National High School Game Academy",
        organization: "Carnegie Mellon University",
        cluster: "Arts",
        location: "Pittsburgh, PA",
        cost: "Paid",
        duration: "6 weeks",
        description: "Learn game design and development from industry professionals at top-ranked program.",
        link: "https://www.cmu.edu/pre-college",
        eligibility: {
            minGPA: 3.0,
            grades: [10, 11],
            hoursRequired: 0,
            skills: ["Arts", "Game Design", "Programming", "Art"]
        },
        matchScore: 88
    },
    {
        id: 35,
        title: "Parsons Summer Intensive Studies",
        organization: "Parsons School of Design",
        cluster: "Arts",
        location: "New York, NY",
        cost: "Paid",
        duration: "3 weeks",
        description: "College-level art and design courses in fashion, graphic design, illustration, and more.",
        link: "https://www.newschool.edu/parsons/pre-college",
        eligibility: {
            minGPA: 2.5,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Design", "Fashion", "Creativity"]
        },
        matchScore: 87
    },
    {
        id: 36,
        title: "All-National Honor Ensembles",
        organization: "National Association for Music Education",
        cluster: "Arts",
        location: "National",
        cost: "Application fee",
        duration: "4 days",
        description: "Premier national honors groups for instrumental and vocal music students.",
        link: "https://nafme.org",
        eligibility: {
            minGPA: 3.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Music", "Performance"]
        },
        matchScore: 90
    },
    {
        id: 37,
        title: "Google Doodle for Google Contest",
        organization: "Google",
        cluster: "Arts",
        location: "National",
        cost: "Free",
        duration: "Annual",
        description: "Design a Google Doodle for a chance to have it featured on Google.com and win scholarships.",
        link: "https://doodles.google.com/d4g",
        eligibility: {
            minGPA: 2.0,
            grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Design", "Creativity"]
        },
        matchScore: 83
    },
    {
        id: 38,
        title: "Congressional Art Competition",
        organization: "U.S. House of Representatives",
        cluster: "Arts",
        location: "National",
        cost: "Free",
        duration: "Annual",
        description: "Nationwide high school arts competition with winning artwork displayed in U.S. Capitol.",
        link: "https://www.house.gov/educators-and-students/congressional-art-competition",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Visual Arts", "Creativity"]
        },
        matchScore: 85
    },
    {
        id: 39,
        title: "Vans Custom Culture",
        organization: "Vans",
        cluster: "Arts",
        location: "National",
        cost: "Free",
        duration: "Annual",
        description: "High school art competition focused on custom shoe design with grants for art programs.",
        link: "https://www.vans.com/customculture",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Design", "Fashion"]
        },
        matchScore: 82
    },
    {
        id: 40,
        title: "The Pulitzer Center Student Fellowships",
        organization: "Pulitzer Center",
        cluster: "Arts",
        location: "Global",
        cost: "Stipend provided",
        duration: "Year-round",
        description: "Reporting fellowships for students to investigate under-reported stories globally.",
        link: "https://pulitzercenter.org",
        eligibility: {
            minGPA: 3.0,
            grades: [13, 14, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Arts", "Writing", "Journalism", "Photography"]
        },
        matchScore: 89
    },
    {
        id: 41,
        title: "National Student Poets Program",
        organization: "Institute of Museum and Library Services",
        cluster: "Arts",
        location: "National",
        cost: "Free",
        duration: "Year-long",
        description: "Nation's highest honor for youth poets presenting original work. Five poets selected annually.",
        link: "https://www.artandwriting.org/what-we-do/national-student-poets-program",
        eligibility: {
            minGPA: 2.5,
            grades: [10, 11],
            hoursRequired: 0,
            skills: ["Arts", "Writing", "Poetry"]
        },
        matchScore: 87
    },
    {
        id: 42,
        title: "Sundance Ignite Fellowship",
        organization: "Sundance Institute",
        cluster: "Arts",
        location: "Virtual + Sundance",
        cost: "Free",
        duration: "Year-long",
        description: "Fellowship for filmmakers ages 18-25 with mentorship from Sundance alumni.",
        link: "https://www.sundance.org",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            hoursRequired: 0,
            skills: ["Arts", "Film", "Storytelling"]
        },
        matchScore: 90
    },
    {
        id: 43,
        title: "School of The New York Times Summer Academy",
        organization: "The New York Times",
        cluster: "Arts",
        location: "New York, NY",
        cost: "Paid",
        duration: "2 weeks",
        description: "Study journalism, writing, media, and photography with New York Times journalists.",
        link: "https://www.nytedu.com",
        eligibility: {
            minGPA: 3.0,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Writing", "Journalism", "Photography"]
        },
        matchScore: 88
    },
    {
        id: 44,
        title: "Pratt Institute PreCollege Program",
        organization: "Pratt Institute",
        cluster: "Arts",
        location: "Brooklyn, NY",
        cost: "Paid",
        duration: "4 weeks",
        description: "College-level instruction in art, design, architecture, and creative writing.",
        link: "https://www.pratt.edu/academics/special-programs/precollege",
        eligibility: {
            minGPA: 2.5,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["Arts", "Design", "Architecture", "Creativity"]
        },
        matchScore: 86
    },

     // ========== HUMANITARIAN CLUSTER (15 opportunities) ==========
    {
        id: 45,
        title: "American Red Cross Youth Services",
        organization: "American Red Cross",
        cluster: "Humanitarian",
        location: "National",
        cost: "Free",
        duration: "Year-round",
        description: "Volunteer opportunities in disaster response, blood drives, and community education.",
        link: "https://www.redcross.org",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Humanitarian", "Service", "Leadership", "First Aid"]
        },
        featured: true,
        matchScore: 85
    },
    {
        id: 46,
        title: "UNICEF Voices of Youth",
        organization: "UNICEF",
        cluster: "Humanitarian",
        location: "Virtual",
        cost: "Free",
        duration: "Ongoing",
        description: "Global platform for young people to advocate for children's rights through writing and media.",
        link: "https://www.voicesofyouth.org",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            hoursRequired: 0,
            skills: ["Humanitarian", "Writing", "Advocacy", "Global Issues"]
        },
        matchScore: 87
    },
    {
        id: 47,
        title: "Habitat for Humanity Youth Programs",
        organization: "Habitat for Humanity",
        cluster: "Humanitarian",
        location: "Local/National",
        cost: "Free",
        duration: "Varies",
        description: "Build homes and hope in local communities through construction and advocacy work.",
        link: "https://www.habitat.org/youthprograms",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Humanitarian", "Service", "Construction", "Community"]
        },
        matchScore: 84
    },
    {
        id: 48,
        title: "Do Something.org Campaigns",
        organization: "DoSomething.org",
        cluster: "Humanitarian",
        location: "Virtual",
        cost: "Free",
        duration: "Ongoing",
        description: "Join national campaigns to tackle social issues like bullying, homelessness, and environment.",
        link: "https://www.dosomething.org",
        eligibility: {
            minGPA: 2.0,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            hoursRequired: 0,
            skills: ["Humanitarian", "Activism", "Social Media", "Organization"]
        },
        matchScore: 86
    },
    {
        id: 49,
        title: "Amnesty International Youth Activist Network",
        organization: "Amnesty International",
        cluster: "Humanitarian",
        location: "Global",
        cost: "Free",
        duration: "Ongoing",
        description: "Defend human rights globally through campaigns, letter-writing, and advocacy events.",
        link: "https://www.amnesty.org/en/get-involved/youth",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            hoursRequired: 0,
            skills: ["Humanitarian", "Advocacy", "Human Rights", "Research"]
        },
        matchScore: 88
    },
    {
        id: 50,
        title: "World Food Programme Youth Ambassador Programme",
        organization: "United Nations World Food Programme",
        cluster: "Humanitarian",
        location: "Global",
        cost: "Free",
        duration: "Year-long",
        description: "Advocate for zero hunger and raise awareness about global food security issues.",
        link: "https://www.wfp.org",
        eligibility: {
            minGPA: 3.0,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            hoursRequired: 50,
            skills: ["Humanitarian", "Public Speaking", "Advocacy", "Global Issues"]
        },
        matchScore: 90
    },
    {
        id: 51,
        title: "Heifer International Read to Feed",
        organization: "Heifer International",
        cluster: "Humanitarian",
        location: "National",
        cost: "Free",
        duration: "School Year",
        description: "Reading incentive program that helps fight hunger and poverty around the world.",
        link: "https://www.heifer.org",
        eligibility: {
            minGPA: 2.0,
            grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Humanitarian", "Reading", "Fundraising", "Global Awareness"]
        },
        matchScore: 83
    },
    {
        id: 52,
        title: "The Borgen Project Internship",
        organization: "The Borgen Project",
        cluster: "Humanitarian",
        location: "Virtual",
        cost: "Unpaid",
        duration: "3 months",
        description: "Advocate for global poverty reduction through political engagement and public awareness.",
        link: "https://borgenproject.org",
        eligibility: {
            minGPA: 3.0,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            hoursRequired: 0,
            skills: ["Humanitarian", "Advocacy", "Political Science", "Writing"]
        },
        matchScore: 87
    },
    {
        id: 53,
        title: "Global Youth Service Day",
        organization: "Youth Service America",
        cluster: "Humanitarian",
        location: "Global",
        cost: "Free",
        duration: "Annual weekend",
        description: "Largest service event in the world, mobilizing youth to address community needs.",
        link: "https://ysa.org/initiatives/gysd",
        eligibility: {
            minGPA: 2.0,
            grades: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            hoursRequired: 0,
            skills: ["Humanitarian", "Service", "Leadership", "Community"]
        },
        matchScore: 85
    },
    {
        id: 54,
        title: "UNHCR Youth Initiative",
        organization: "UN Refugee Agency",
        cluster: "Humanitarian",
        location: "Global",
        cost: "Free",
        duration: "Ongoing",
        description: "Advocate for refugee rights and support displaced communities worldwide.",
        link: "https://www.unhcr.org/youth",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            hoursRequired: 0,
            skills: ["Humanitarian", "Advocacy", "Global Issues", "Research"]
        },
        matchScore: 88
    },
    {
        id: 55,
        title: "Me to We Leadership Programs",
        organization: "WE Charity",
        cluster: "Humanitarian",
        location: "Global",
        cost: "Paid",
        duration: "1-2 weeks",
        description: "Leadership development and service trips to communities in need around the world.",
        link: "https://www.we.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 20,
            skills: ["Humanitarian", "Leadership", "Service", "Global Awareness"]
        },
        matchScore: 86
    },
    {
        id: 56,
        title: "Peace Corps Prep Program",
        organization: "Peace Corps",
        cluster: "Humanitarian",
        location: "University Partners",
        cost: "Free",
        duration: "Academic Program",
        description: "Undergraduate certificate program preparing students for international development work.",
        link: "https://www.peacecorps.gov/volunteer/university-programs/peace-corps-prep",
        eligibility: {
            minGPA: 2.8,
            grades: [13, 14, 15, 16],
            hoursRequired: 50,
            skills: ["Humanitarian", "Language", "Cross-cultural", "Leadership"]
        },
        matchScore: 89
    },
    {
        id: 57,
        title: "Doctors Without Borders Student Chapters",
        organization: "Médecins Sans Frontières",
        cluster: "Humanitarian",
        location: "University Campuses",
        cost: "Free",
        duration: "Ongoing",
        description: "Advocate for global health equity and support humanitarian medical missions.",
        link: "https://www.doctorswithoutborders.org",
        eligibility: {
            minGPA: 2.5,
            grades: [13, 14, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Humanitarian", "Healthcare", "Advocacy", "Global Health"]
        },
        matchScore: 87
    },
    {
        id: 58,
        title: "Oxfam America Youth Engagement",
        organization: "Oxfam America",
        cluster: "Humanitarian",
        location: "National",
        cost: "Free",
        duration: "Ongoing",
        description: "Fight poverty and injustice through advocacy campaigns and community organizing.",
        link: "https://www.oxfamamerica.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            hoursRequired: 0,
            skills: ["Humanitarian", "Advocacy", "Social Justice", "Organizing"]
        },
        matchScore: 85
    },
    {
        id: 59,
        title: "CARE National Student Alliance",
        organization: "CARE",
        cluster: "Humanitarian",
        location: "National",
        cost: "Free",
        duration: "Ongoing",
        description: "Student-led movement to fight global poverty and empower women and girls.",
        link: "https://www.care.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Humanitarian", "Gender Equality", "Advocacy", "Leadership"]
        },
        matchScore: 84
    },

    // ========== CIVICS CLUSTER (20 opportunities) ==========
    {
        id: 60,
        title: "TSA Webmaster Competition",
        organization: "Technology Student Association",
        cluster: "STEM",
        location: "National",
        cost: "Entry Fee",
        duration: "Academic Year",
        description: "Develop and submit a comprehensive website for TSA's Webmaster competitive event. Showcase web development skills, design, and functionality.",
        link: "https://tsaweb.org/about",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Web Development", "HTML", "CSS", "JavaScript", "Design"]
        },
        featured: true,
        matchScore: 95
    },
    {
        id: 61,
        title: "Boys State / Girls State",
        organization: "American Legion",
        cluster: "Civics",
        location: "State Level",
        cost: "Free",
        duration: "1 week",
        description: "Premier leadership and government education program for high school juniors.",
        link: "https://www.legion.org/boysnation",
        eligibility: {
            minGPA: 3.0,
            grades: [11],
            hoursRequired: 0,
            skills: ["Civics", "Leadership", "Government", "Public Speaking"]
        },
        featured: true,
        matchScore: 92
    },
    {
        id: 61,
        title: "YMCA Youth in Government",
        organization: "YMCA",
        cluster: "Civics",
        location: "State Level",
        cost: "Program fee",
        duration: "Academic Year",
        description: "Model government program where students serve as legislators, lobbyists, and judges.",
        link: "https://www.ymca.net/youth-government",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Government", "Debate", "Leadership"]
        },
        matchScore: 88
    },
    {
        id: 62,
        title: "Congressional Award",
        organization: "U.S. Congress",
        cluster: "Civics",
        location: "National",
        cost: "Registration fee",
        duration: "Flexible",
        description: "Non-partisan award recognizing initiative, service, and achievement in young Americans.",
        link: "https://congressionalaward.org",
        eligibility: {
            minGPA: 2.0,
            grades: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            hoursRequired: 200,
            skills: ["Civics", "Service", "Personal Development", "Expedition"]
        },
        matchScore: 85
    },
    {
        id: 63,
        title: "Close Up Foundation Programs",
        organization: "Close Up Foundation",
        cluster: "Civics",
        location: "Washington, DC",
        cost: "Paid",
        duration: "1 week",
        description: "Immerse in Washington, DC politics and government through meetings with officials.",
        link: "https://www.closeup.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Government", "Politics", "Critical Thinking"]
        },
        matchScore: 87
    },
    {
        id: 64,
        title: "National Student Leadership Conference - Politics & Public Policy",
        organization: "NSLC",
        cluster: "Civics",
        location: "Washington, DC",
        cost: "Paid",
        duration: "9 days",
        description: "Hands-on leadership program in politics, law, and public policy at Georgetown University.",
        link: "https://www.nslcleaders.org",
        eligibility: {
            minGPA: 3.0,
            grades: [9, 10, 11],
            hoursRequired: 0,
            skills: ["Civics", "Leadership", "Politics", "Public Policy"]
        },
        matchScore: 90
    },
    {
        id: 65,
        title: "Model United Nations Conferences",
        organization: "Various",
        cluster: "Civics",
        location: "National/International",
        cost: "Registration fee",
        duration: "2-5 days",
        description: "Simulate UN committees to debate global issues and draft resolutions.",
        link: "https://www.un.org/model-united-nations",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12, 13, 14, 15, 16],
            hoursRequired: 0,
            skills: ["Civics", "Diplomacy", "Research", "Public Speaking"]
        },
        matchScore: 89
    },
    {
        id: 66,
        title: "Presidential Classroom",
        organization: "Presidential Classroom",
        cluster: "Civics",
        location: "Washington, DC",
        cost: "Paid",
        duration: "1 week",
        description: "Leadership and civic education program with focus on federal government processes.",
        link: "https://presidentialclassroom.org",
        eligibility: {
            minGPA: 3.0,
            grades: [10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Leadership", "Government", "Critical Thinking"]
        },
        matchScore: 86
    },
    {
        id: 67,
        title: "We the People Program",
        organization: "Center for Civic Education",
        cluster: "Civics",
        location: "National",
        cost: "Free",
        duration: "Academic Year",
        description: "Constitutional education program culminating in simulated congressional hearings.",
        link: "https://www.civiced.org/wtp",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Constitution", "Debate", "Research"]
        },
        matchScore: 84
    },
    {
        id: 68,
        title: "National Youth Leadership Council",
        organization: "NYLC",
        cluster: "Civics",
        location: "National",
        cost: "Membership fee",
        duration: "Ongoing",
        description: "Develop leadership skills through service-learning and civic engagement projects.",
        link: "https://www.nylc.org",
        eligibility: {
            minGPA: 2.5,
            grades: [6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Leadership", "Service-Learning", "Community"]
        },
        matchScore: 83
    },
    {
        id: 69,
        title: "Future Business Leaders of America",
        organization: "FBLA",
        cluster: "Civics",
        location: "National",
        cost: "Membership fee",
        duration: "Academic Year",
        description: "Prepare students for careers in business through leadership development and competitions.",
        link: "https://www.fbla.org",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Business", "Leadership", "Entrepreneurship"]
        },
        matchScore: 85
    },
    {
        id: 70,
        title: "DECA High School Division",
        organization: "DECA",
        cluster: "Civics",
        location: "National",
        cost: "Membership fee",
        duration: "Academic Year",
        description: "Prepare emerging leaders and entrepreneurs in marketing, finance, hospitality and management.",
        link: "https://www.deca.org",
        eligibility: {
            minGPA: 2.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Business", "Marketing", "Entrepreneurship"]
        },
        matchScore: 84
    },
    {
        id: 71,
        title: "Junior State of America",
        organization: "JSA",
        cluster: "Civics",
        location: "National",
        cost: "Membership fee",
        duration: "Academic Year",
        description: "Student-run organization fostering political awareness and leadership through debate.",
        link: "https://www.jsa.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Debate", "Politics", "Leadership"]
        },
        matchScore: 87
    },
    {
        id: 72,
        title: "National History Day Competition",
        organization: "National History Day",
        cluster: "Civics",
        location: "National",
        cost: "Registration fee",
        duration: "Academic Year",
        description: "Research competition where students create documentaries, exhibits, papers, or performances.",
        link: "https://www.nhd.org",
        eligibility: {
            minGPA: 2.0,
            grades: [6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Research", "History", "Presentation"]
        },
        matchScore: 82
    },
    {
        id: 73,
        title: "Constitutional Rights Foundation Programs",
        organization: "CRF",
        cluster: "Civics",
        location: "National",
        cost: "Free/Paid",
        duration: "Varies",
        description: "Law-related education programs including mock trials, voter education, and civic participation.",
        link: "https://www.crf-usa.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Law", "Government", "Critical Thinking"]
        },
        matchScore: 86
    },
    {
        id: 74,
        title: "National Speech & Debate Association",
        organization: "NSDA",
        cluster: "Civics",
        location: "National",
        cost: "Membership fee",
        duration: "Academic Year",
        description: "Develop communication, research, and critical thinking skills through speech and debate.",
        link: "https://www.speechanddebate.org",
        eligibility: {
            minGPA: 2.0,
            grades: [6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Debate", "Public Speaking", "Research"]
        },
        matchScore: 88
    },
    {
        id: 75,
        title: "National High School Mock Trial Championship",
        organization: "National High School Mock Trial",
        cluster: "Civics",
        location: "National",
        cost: "Registration fee",
        duration: "Academic Year",
        description: "Simulate courtroom trials where students play attorneys and witnesses.",
        link: "https://www.nationalmocktrial.org",
        eligibility: {
            minGPA: 2.5,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Law", "Public Speaking", "Critical Thinking"]
        },
        matchScore: 87
    },
    {
        id: 76,
        title: "C-SPAN StudentCam Competition",
        organization: "C-SPAN",
        cluster: "Civics",
        location: "National",
        cost: "Free",
        duration: "Annual",
        description: "Documentary competition on national policy issues with cash prizes.",
        link: "https://www.studentcam.org",
        eligibility: {
            minGPA: 2.0,
            grades: [6, 7, 8, 9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Film", "Research", "Politics"]
        },
        matchScore: 83
    },
    {
        id: 77,
        title: "National Youth Forum on National Security",
        organization: "U.S. Army War College",
        cluster: "Civics",
        location: "Carlisle, PA",
        cost: "Free",
        duration: "4 days",
        description: "Examine national security challenges and develop policy recommendations.",
        link: "https://www.armywarcollege.edu",
        eligibility: {
            minGPA: 3.0,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["Civics", "National Security", "Policy", "Critical Thinking"]
        },
        matchScore: 90
    },
    {
        id: 78,
        title: "Federal Reserve Bank Student Programs",
        organization: "Federal Reserve System",
        cluster: "Civics",
        location: "Regional",
        cost: "Free",
        duration: "Varies",
        description: "Learn about economics, monetary policy, and the central banking system.",
        link: "https://www.federalreserveeducation.org",
        eligibility: {
            minGPA: 3.0,
            grades: [9, 10, 11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Economics", "Finance", "Policy"]
        },
        matchScore: 85
    },
    {
        id: 79,
        title: "National Judicial College Programs",
        organization: "National Judicial College",
        cluster: "Civics",
        location: "Reno, NV",
        cost: "Scholarships available",
        duration: "1 week",
        description: "Introduction to judicial system and legal processes for high school students.",
        link: "https://www.judges.org",
        eligibility: {
            minGPA: 3.0,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["Civics", "Law", "Judicial System", "Critical Thinking"]
        },
        matchScore: 88
    },

    // ========== SCHOLARSHIPS CLUSTER (20 opportunities) ==========
    {
        id: 80,
        title: "Gates Scholarship",
        organization: "Bill & Melinda Gates Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "Full Scholarship",
        duration: "Through College",
        description: "Highly selective, last-dollar scholarship for outstanding minority students with financial need.",
        link: "https://www.thegatesscholarship.org",
        eligibility: {
            minGPA: 3.3,
            grades: [12],
            hoursRequired: 0,
            skills: ["Leadership", "Community Service", "Academic Excellence"]
        },
        featured: true,
        matchScore: 98
    },
    {
        id: 81,
        title: "Coca-Cola Scholars Program",
        organization: "Coca-Cola Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "$20,000 Scholarship",
        duration: "One-time award",
        description: "Recognizes high school seniors who demonstrate leadership, service, and academic excellence.",
        link: "https://www.coca-colascholarsfoundation.org",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Leadership", "Service", "Academic Excellence"]
        },
        matchScore: 92
    },
    {
        id: 82,
        title: "Horatio Alger Scholarship",
        organization: "Horatio Alger Association",
        cluster: "Scholarships",
        location: "National",
        cost: "$25,000 Scholarship",
        duration: "Through College",
        description: "Supports students who have overcome adversity and demonstrate integrity and perseverance.",
        link: "https://scholars.horatioalger.org",
        eligibility: {
            minGPA: 2.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Overcoming Adversity", "Integrity", "Perseverance"]
        },
        matchScore: 87
    },
    {
        id: 83,
        title: "QuestBridge National College Match",
        organization: "QuestBridge",
        cluster: "Scholarships",
        location: "National",
        cost: "Full Scholarship",
        duration: "Through College",
        description: "Connects high-achieving, low-income students with full four-year scholarships to top colleges.",
        link: "https://www.questbridge.org",
        eligibility: {
            minGPA: 3.5,
            grades: [12],
            hoursRequired: 0,
            skills: ["Academic Excellence", "Financial Need", "Leadership"]
        },
        matchScore: 95
    },
    {
        id: 84,
        title: "Jack Kent Cooke Foundation College Scholarship",
        organization: "Jack Kent Cooke Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "Up to $40,000/year",
        duration: "Through College",
        description: "Comprehensive scholarship for high-achieving students with financial need.",
        link: "https://www.jkcf.org",
        eligibility: {
            minGPA: 3.5,
            grades: [12],
            hoursRequired: 0,
            skills: ["Academic Excellence", "Financial Need", "Leadership"]
        },
        matchScore: 94
    },
    {
        id: 85,
        title: "Dell Scholars Program",
        organization: "Michael & Susan Dell Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "$20,000 Scholarship",
        duration: "Through College",
        description: "Supports low-income, highly motivated students who demonstrate determination to succeed.",
        link: "https://www.dellscholars.org",
        eligibility: {
            minGPA: 2.4,
            grades: [12],
            hoursRequired: 0,
            skills: ["Determination", "Financial Need", "Academic Potential"]
        },
        matchScore: 86
    },
    {
        id: 86,
        title: "Ron Brown Scholar Program",
        organization: "Ron Brown Scholar Fund",
        cluster: "Scholarships",
        location: "National",
        cost: "$40,000 Scholarship",
        duration: "Through College",
        description: "Merit-based scholarship for African American high school seniors demonstrating leadership.",
        link: "https://www.ronbrown.org",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Leadership", "Community Service", "Academic Excellence"]
        },
        matchScore: 90
    },
    {
        id: 87,
        title: "Elks Most Valuable Student Competition",
        organization: "Elks National Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "Up to $50,000",
        duration: "Four years",
        description: "Merit-based scholarship considering leadership, scholarship, and financial need.",
        link: "https://www.elks.org/scholars",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Leadership", "Academic Excellence", "Financial Need"]
        },
        matchScore: 88
    },
    {
        id: 88,
        title: "AXA Achievement Scholarship",
        organization: "AXA Equitable Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "$25,000 Scholarship",
        duration: "One-time award",
        description: "Recognizes students who demonstrate ambition and drive to succeed.",
        link: "https://www.axa-achievement.com",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Ambition", "Drive", "Achievement"]
        },
        matchScore: 85
    },
    {
        id: 89,
        title: "GE-Reagan Foundation Scholarship",
        organization: "Ronald Reagan Presidential Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "$10,000 Scholarship",
        duration: "Renewable",
        description: "Awarded to students demonstrating leadership, drive, integrity, and citizenship.",
        link: "https://www.reaganfoundation.org",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Leadership", "Integrity", "Citizenship"]
        },
        matchScore: 87
    },
    {
        id: 90,
        title: "Cameron Impact Scholarship",
        organization: "Bryan Cameron Education Foundation",
        cluster: "Scholarships",
        location: "National",
        cost: "Full Tuition",
        duration: "Through College",
        description: "Merit-based scholarship for students with demonstrated leadership and community impact.",
        link: "https://www.bryancameroneducationfoundation.org",
        eligibility: {
            minGPA: 3.7,
            grades: [12],
            hoursRequired: 0,
            skills: ["Leadership", "Community Impact", "Academic Excellence"]
        },
        matchScore: 93
    },
    {
        id: 91,
        title: "Amazon Future Engineer Scholarship",
        organization: "Amazon",
        cluster: "Scholarships",
        location: "National",
        cost: "$40,000 Scholarship",
        duration: "Through College",
        description: "Supports high school seniors from underserved communities pursuing computer science degrees.",
        link: "https://www.amazonfutureengineer.com",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["Computer Science", "Financial Need", "Academic Excellence"]
        },
        matchScore: 89
    },
    {
        id: 92,
        title: "Buick Achievers Scholarship",
        organization: "General Motors",
        cluster: "Scholarships",
        location: "National",
        cost: "$25,000 Scholarship",
        duration: "Renewable",
        description: "Supports students pursuing STEM fields who demonstrate leadership and innovation.",
        link: "https://www.buickachievers.com",
        eligibility: {
            minGPA: 3.0,
            grades: [12],
            hoursRequired: 0,
            skills: ["STEM", "Leadership", "Innovation"]
        },
        matchScore: 88
    },
    {
        id: 93,
        title: "National Merit Scholarship Program",
        organization: "National Merit Scholarship Corporation",
        cluster: "Scholarships",
        location: "National",
        cost: "$2,500-$10,000",
        duration: "Varies",
        description: "Recognizes academic excellence through PSAT/NMSQT performance.",
        link: "https://www.nationalmerit.org",
        eligibility: {
            minGPA: 3.5,
            grades: [11, 12],
            hoursRequired: 0,
            skills: ["Academic Excellence", "Test Performance"]
        },
        matchScore: 91
    },
    {
id: 94,
title: "Hispanic Scholarship Fund",
organization: "HSF",
cluster: "Scholarships",
location: "National",
cost: "$500-$5,000",
duration: "One-time/Renewable",
description: "Supports Hispanic American students pursuing higher education with mentorship and career services.",
link: "https://www.hsf.net",
eligibility: {
minGPA: 3.0,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["Hispanic Heritage", "Academic Excellence", "Leadership"]
},
matchScore: 88
    },
{
id: 95,
title: "UNCF Scholarships",
organization: "United Negro College Fund",
cluster: "Scholarships",
location: "National",
cost: "Varies ($1,000-$10,000+)",duration: "Varies",
description: "Multiple scholarship programs supporting African American students at HBCUs and other institutions.",
link: "https://www.uncf.org",
eligibility: {
minGPA: 2.5,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["African American Heritage", "Academic Achievement", "Community Service"]
},
matchScore: 86
    },
    {
id: 96,
title: "Asian & Pacific Islander American Scholarship Fund",
organization: "APIASF",
cluster: "Scholarships",
location: "National",
cost: "$2,500-$15,000",
duration: "One-time/Renewable",
description: "Largest nonprofit providing scholarships to Asian and Pacific Islander Americans.",
link: "https://www.apiasf.org",
eligibility: {
minGPA: 2.7,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["API Heritage", "Leadership", "Community Service"]
    },
    matchScore: 85
},
{
id: 97,
title: "Google Lime Scholarship",
organization: "Google",
cluster: "Scholarships",
location: "National",
cost: "$10,000",
duration: "Academic Year",
description: "Supports students with disabilities pursuing computer science or related fields.",
link: "https://buildyourfuture.withgoogle.com/scholarships/google-lime-scholarship",
eligibility: {
minGPA: 3.0,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["Disability Advocacy", "Computer Science", "Leadership"] },
matchScore: 87
},
{
id: 98,
title: "Microsoft Disability Scholarship",
organization: "Microsoft",
cluster: "Scholarships",
location: "National",
cost: "$5,000",
duration: "Renewable",
description: "Supports high school students with disabilities pursuing technology careers.",
link: "https://www.microsoft.com/en-us/diversity/programs/disability-scholarship",
eligibility: { 
minGPA: 3.0,grades: [12],
hoursRequired: 0,
skills: ["Disability Advocacy", "Technology", "Leadership"]
},
matchScore: 86
},
{
id: 99,
title: "Catching the Dream Scholarship",
organization: "Catching the Dream",
cluster: "Scholarships",
location: "National",
cost: "$500-$5,000",
duration: "Varies",
description: "Supports Native American students pursuing highereducation in various fields.",
link: "https://www.catchingthedream.org",
eligibility: {
minGPA: 3.0,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["Native American Heritage", "Academic Excellence", "Community Service"]
},
matchScore: 84
},
{
id: 100,
title: "Women in STEM Scholarships",
organization: "Various Organizations",
cluster: "Scholarships",location: "National",
cost: "Varies",
duration: "Varies",
description: "Multiple scholarship programs specifically for women pursuing STEM degrees.",
link: "https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type/scholarships-for-women/stem-scholarships-for-women",
eligibility: {
minGPA: 3.0,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["STEM", "Women in STEM", "Academic Excellence"]
},
matchScore: 90
},
{
id: 101,
title: "First Generation College Student Scholarships",
organization: "Various Foundations",
cluster: "Scholarships",
location: "National",
cost: "Varies",
duration: "Varies",
description: "Multiple programs supporting students who are first in their family to attend college.",
link: "https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type/first-generation-college-student-scholarships",
eligibility: {
minGPA: 2.5,
grades: [12, 13, 14, 15, 16],
hoursRequired: 0,
skills: ["First Generation", "Academic Achievement", "Perseverance"]
},
matchScore: 85
},
{
id: 102,
title: "Community College Transfer Scholarships",
organization: "Jack Kent Cooke Foundation",
cluster: "Scholarships",
location: "National",
cost: "Up to $40,000/year",
duration: "2-3 years",
description: "Supports high-achieving community college students transferring to four-year institutions.",
link: "https://www.jkcf.org/our-scholarships/undergraduate-transfer-scholarship",
eligibility: {
minGPA: 3.5,
grades: [14, 15],
hoursRequired: 0,
skills: ["Academic Excellence", "Transfer Student", "Leadership"]
},
matchScore: 88
}
];
// ============================================
// CLUSTER DEFINITIONS AND COLORS
// ============================================

const clusters = {
STEM: {
name: "STEM",
color: "#3b82f6", // Blue
icon: "🧪",
description: "Science, Technology, Engineering, and Mathematics opportunities"
},
Arts: {
name: "Arts",
color: "#8b5cf6", // Purple
icon: "🎨",
description: "Creative arts including visual arts, performing arts, writing, and design"
},
Humanitarian: {
name: "Humanitarian",
color: "#10b981", // Green
icon: "🤝",
description: "Community service, global development, and social justice initiatives"
},
Civics: {
name: "Civics",
color: "#ef4444", // Red
icon: "🏛️",
description: "Government, politics, law, leadership, and civic engagement programs"
},
Scholarships: {
name: "Scholarships",
color: "#f59e0b", // Amber
icon: "💰",
description: "Financial aid and scholarship opportunities for education"
}
};

// Make data globally available
window.opportunitiesData = opportunitiesData;
window.clusters = clusters;

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

// Make data available globally
window.opportunitiesData = opportunitiesData;
window.clusters = clusters;

// For modular JavaScript (if using modules)
if (typeof module !== 'undefined' && module.exports) {
module.exports = {
opportunitiesData,
clusters
};
}