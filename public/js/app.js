console.log("FlexCore Technologies loaded successfully.");

document.addEventListener("DOMContentLoaded", () => {

    console.log("FlexCore platform ready.");

    const projectDetails =
        document.getElementById("project-details");

    const closeProject =
        document.getElementById("close-project");

    const projectTitle =
        document.getElementById("project-title");

    const projectDescription =
        document.getElementById("project-description");

    const projectCategory =
        document.getElementById("project-category");

    const projectStage =
        document.getElementById("project-stage");

    const projectStatus =
        document.getElementById("project-status");

    const projectTechnology =
        document.getElementById("project-technology");

    const projectAreas =
        document.getElementById("project-areas");


    const projects = {

        wifi: {
            status: "PROJECT 01 • ACTIVE DEVELOPMENT",

            title: "Wi-Fi Billing System",

            description:
                "A practical network access and billing platform " +
                "for managing customers, packages, payments and " +
                "Internet access services.",

            category:
                "Networking / Software",

            stage:
                "Active Development",

            technology:
                "Node.js • Express • REST APIs • JSON Storage • M-Pesa",

            areas:
                "Customer Management • Packages • Payments • " +
                "Subscriptions • Expiry Engine • Recycle Bin"
        },


        android: {
            status: "PROJECT 02 • RESEARCH",

            title: "Android Flashing Tool",

            description:
                "A research project focused on Android device " +
                "communication, firmware management, diagnostics " +
                "and servicing workflows.",

            category:
                "Android / Device Engineering",

            stage:
                "Research & Development",

            technology:
                "Android • ADB • Fastboot • Device Protocols",

            areas:
                "Device Detection • Diagnostics • Firmware • " +
                "ADB • Fastboot • Servicing Workflows"
        },


        network: {
            status: "PROJECT 03 • ONGOING",

            title: "Network Systems",

            description:
                "Research and development involving connectivity, " +
                "authentication, network infrastructure and " +
                "digital access systems.",

            category:
                "Networking / Infrastructure",

            stage:
                "Ongoing Research",

            technology:
                "Networking • Authentication • Infrastructure",

            areas:
                "Connectivity • Access Control • Authentication • " +
                "Infrastructure • Digital Access"
        }

    };


    function openProject(projectId) {

        const project = projects[projectId];

        if (!project) {
            return;
        }


        projectStatus.textContent =
            project.status;

        projectTitle.textContent =
            project.title;

        projectDescription.textContent =
            project.description;

        projectCategory.textContent =
            project.category;

        projectStage.textContent =
            project.stage;

        projectTechnology.textContent =
            project.technology;

        projectAreas.textContent =
            project.areas;


        projectDetails.classList.add("active");

        projectDetails.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeProjectPanel() {

        projectDetails.classList.remove("active");

        projectDetails.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    document
        .querySelectorAll(".project-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                openProject(
                    button.dataset.project
                );

            });

        });


    closeProject.addEventListener(
        "click",
        closeProjectPanel
    );


    projectDetails.addEventListener(
        "click",
        event => {

            if (event.target === projectDetails) {
                closeProjectPanel();
            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeProjectPanel();
            }

        }
    );

});
