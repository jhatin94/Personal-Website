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

        _addAnalyticsEventToAllProjectLinks();

        // show page
        Main.sendPageview(Main.analyticPageTitles.projects);
        Main.showPage(Main.pageContainers.projectsPageContainer);
    }
    /*end public functions*/

    /*private functions*/
    function _addAnalyticsEventToAllProjectLinks() {
        var pLinks = document.getElementsByClassName("pLink");
        var i = 0;
        var l = pLinks.length;
        for (i; i < l; i++) {
            var link = pLinks[i].firstChild;
            Main.addClickEventToElement(link, function (e) {
                Main.sendAnalyticsEvent("UX", "click", e.target.href); // send page visited to analytics
            });
        }
    }
    /*end private functions*/
    return {
        renderPage: renderPage
    }
})();