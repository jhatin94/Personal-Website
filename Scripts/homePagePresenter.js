// Home Page Presenter
	
var HomePagePresenter = (function() {
	/*public properties*/
	/*end public properties*/
	
	/*private properties*/
	/*end private properties*/
	
	/*public functions*/
	function DOMReady(callback) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            return callback();
        }
        document.addEventListener('DOMContentLoaded', callback, false);
    }
	function renderPage() {
		
	}
	/*end public functions*/
	
	/*private functions*/
	/*end private functions*/
	
	return {
		DOMReady: DOMReady,
		renderPage: renderPage
	}
})();

window.onload = HomePagePresenter.DOMReady(function () {HomePagePresenter.renderPage();});