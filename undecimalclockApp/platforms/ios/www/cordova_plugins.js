cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.testflightapp.cordova-plugin/www/testflight.js",
        "id": "com.testflightapp.cordova-plugin.TestFlight",
        "clobbers": [
            "TestFlight"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "1.0.2",
    "org.apache.cordova.device": "0.2.10",
    "com.testflightapp.cordova-plugin": "3.1.0"
}
// BOTTOM OF METADATA
});