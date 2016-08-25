// renders homepage and handles activity there

var HomePagePresenter = (function () {
    /*public properties*/
    /*end public properties*/

    /*private properties*/
    /*end private properties*/

    /*public functions*/
    function renderPage() {
        // set up any necessary events
        Main.addClickEventToElement(document.getElementById("projectLink"), function () {
            Main.sendAnalyticsEvent("UX", "click", "Projects Page");
            Main.changeHash(Main.pageHashes.projects);
        });
        Main.addClickEventToElement(document.getElementById("homeResumeLink"), function () {
            Main.sendAnalyticsEvent("UX", "click", "Resume Viewed");
        });
        Main.addClickEventToElement(document.getElementById("homeLinkedInOpt"), function () {
            Main.sendAnalyticsEvent("UX", "click", "LinkedIn Profile Viewed");
            Main.changeHash(Main.pageHashes.projects);
        });

        // show page
        Main.sendPageview(Main.analyticPageTitles.home);
        Main.showPage(Main.pageContainers.homePageContainer);
    }
    /*end public functions*/

    /*private properties*/
    /*end private functions*/
    return {
        renderPage: renderPage
    }
})();