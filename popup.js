document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') { // Check if the spacebar is pressed
        console.log('The spacebar has been hit')
        chrome.tabs.create({ url: 'https://m365.cloud.microsoft/login?es=Click&ru=%2Fapps%3Fhome%3D1%26acctsw%3D1&prompt=select_account' }); // redirect to sign in :)
    }
});