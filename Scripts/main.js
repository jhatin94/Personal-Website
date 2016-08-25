// main JS file, handles loading all subsequent pages and houses global functions

var Main = (function () {
    /*public properties*/
    var pageHashes = {
        home: "#home",
        projects: "#projects"
    }
    var pageContainers = {
        homePageContainer: "homePageContainer",
        projectsPageContainer: "projectsPageContainer"
    }
    var pageTitles = {
        home: "Justin Hatin",
        projects: "Projects"
    }
    var analyticPageTitles = {
        home: "Home Page",
        projects: "Projects Page"
    }
    /*end public properties*/

    /*private properties*/
    var _homeLoaded = false;
    var _projectLoaded = false;
    var _containers = ["homePageContainer", "projectsPageContainer"];
    var _currentYear;
    /*end private properties*/

    /*public functions*/
    function DOMReady(callback) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            return callback();
        }
        document.addEventListener('DOMContentLoaded', callback, false);
    }
    function renderPage(hash) {
        _hideAllPages();
        _loadHTML(function () {
            switch (hash) {
                case Main.pageHashes.home:
                    document.title = Main.pageTitles.home;
                    HomePagePresenter.renderPage();
                    break;
                case Main.pageHashes.projects:
                    document.title = Main.pageTitles.projects;
                    ProjectsPagePresenter.renderPage();
                default:
                    break;
            }
        });
    }
    function showPage(pageContainer) {
        var container = document.getElementById(pageContainer);
        if (container.classList.contains("hide")) {
            container.classList.remove("hide");
        }
        if (!container.classList.contains("show")) {
            container.classList.add("show");
        }
    }
    function hidePage(pageContainer) {
        var container = pageContainer;
        if (container) {
            if (container.classList.contains("show")) {
                container.classList.remove("show");
            }
            if (!container.classList.contains("hide")) {
                container.classList.add("hide");
            }
        }
    }
    function addClickEventToElement(element, event) {
        element.addEventListener("click", event);
    }
    function changeHash(hash) {
        if (window.location.hash != hash) {
            window.location.hash = hash;
        }
    }
    function sendAnalyticsEvent(category, action, label, value) {
        if (value) {
            ga('send', 'event', category, action, label, value);
        }
        else {
            ga('send', 'event', category, action, label);
        }
    }
    function sendPageview(page) {
        ga('set', {
            page: page,
            title: page
        });
        ga('send', 'pageview', page);
    }
    /*end public functions*/

    /*private functions*/
    function _hideAllPages() {
        var i = 0;
        var l = _containers.length;
        for (i; i < l; i++) {
            var container = document.getElementById(_containers[i]);
            Main.hidePage(container);
        }
    }
    function _loadHTML(callback) {
        if (!_isSiteLoaded()) {
            _loadHomeHTML(function () {
                if (_isSiteLoaded()) {
                    callback();
                }
            });
            _loadProjectsHTML(function () {
                if (_isSiteLoaded()) {
                    callback();
                }
            });
        }
        else {
            callback();
        }
    }
    function _loadHomeHTML(loadedCallback) {
        // do html modifications
        var homePage = document.getElementById(Main.pageContainers.homePageContainer);
        if (homePage) {
            var homePageHTML = homePage.innerHTML;
            _currentYear = new Date().getFullYear();
            homePageHTML = homePageHTML.replace("{currentYear}", _currentYear);
            homePage.innerHTML = homePageHTML;
            _homeLoaded = true;
            loadedCallback();
        }
    }
    function _loadProjectsHTML(loadedCallback) {
        // do html modifications
        var projectsPage = document.getElementById(Main.pageContainers.projectsPageContainer);
        if (projectsPage) {
            var projectPageHTML = projectsPage.innerHTML;
            projectPageHTML = projectPageHTML.replace("{currentYear}", _currentYear);
            projectsPage.innerHTML = projectPageHTML;
            _projectLoaded = true;
            loadedCallback();
        }
    }
    function _isSiteLoaded() {
        return _homeLoaded && _projectLoaded;
    }
    /*end private functions*/

    return {
        DOMReady: DOMReady,
        pageHashes: pageHashes,
        pageContainers: pageContainers,
        pageTitles: pageTitles,
        analyticPageTitles: analyticPageTitles,
        sendAnalyticsEvent: sendAnalyticsEvent,
        sendPageview: sendPageview,
        showPage: showPage,
        hidePage: hidePage,
        changeHash: changeHash,
        addClickEventToElement: addClickEventToElement,
        renderPage: renderPage
    }
})();

var initialHash = "#home";
var previousURL = null;
window.location.hash = initialHash;
window.onload = Main.DOMReady(function () { Main.renderPage(window.location.hash); });
window.onhashchange = function (e) {
    previousURL = e.oldURL;
    Main.renderPage(window.location.hash);
}