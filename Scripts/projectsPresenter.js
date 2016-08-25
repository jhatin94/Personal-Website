// renders projects page and handles activity there

var ProjectsPagePresenter = (function () {
    /*public properties*/
    /*end public properties*/

    /*private properties*/
    /*end private properties*/

    /*public functions*/
    function renderPage() {
        // set up any necessary events
        //Main.addClickEventToElement(document.getElementById("infoSquare"), function () {
        //    Main.sendAnalyticsEvent("UX", "click", "Info Square");
        //    Main.changeHash(Main.pageHashes.info);
        //});

        // show page
        Main.sendPageview(Main.analyticPageTitles.projects);
        Main.showPage(Main.pageContainers.homePageContainer);
    }
    /*end public functions*/

    /*private properties*/
    /*end private functions*/
    return {
        renderPage: renderPage
    }
})();