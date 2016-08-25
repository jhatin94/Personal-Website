// renders projects page and handles activity there

var ProjectsPagePresenter = (function () {
    /*public properties*/
    /*end public properties*/

    /*private properties*/
    /*end private properties*/

    /*public functions*/
    function renderPage() {
        // set up any necessary events
        Main.addClickEventToElement(document.getElementById("homeLink"), function () {
            Main.sendAnalyticsEvent("UX", "click", "Returned Home");
            Main.changeHash(Main.pageHashes.home);
        });
        Main.addClickEventToElement(document.getElementById("projResumeLink"), function () {
            Main.sendAnalyticsEvent("UX", "click", "Resume Viewed");
        });
        Main.addClickEventToElement(document.getElementById("projLinkedInOpt"), function () {
            Main.sendAnalyticsEvent("UX", "click", "LinkedIn Profile Viewed");
            Main.changeHash(Main.pageHashes.projects);
        });

        // show page
        Main.sendPageview(Main.analyticPageTitles.projects);
        Main.showPage(Main.pageContainers.projectsPageContainer);
    }
    /*end public functions*/

    /*private properties*/
    /*end private functions*/
    return {
        renderPage: renderPage
    }
})();