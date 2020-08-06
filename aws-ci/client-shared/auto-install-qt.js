// Qt-Installer Framework automation script
// See also: https://stackoverflow.com/questions/25105269/silent-install-qt-run-installer-on-ubuntu-server/34032216#34032216

function Controller() {
    installer.autoRejectMessageBoxes();
    installer.setMessageBoxAutomaticAnswer("installationError", QMessageBox.Retry);
    installer.setMessageBoxAutomaticAnswer("installationErrorWithRetry", QMessageBox.Retry);
    installer.setMessageBoxAutomaticAnswer("DownloadError", QMessageBox.Retry);
    installer.setMessageBoxAutomaticAnswer("archiveDownloadError", QMessageBox.Retry);
    installer.installationFinished.connect(function () {
        gui.clickButton(buttons.NextButton);
    })
}

Controller.prototype.WelcomePageCallback = function () {
    // click delay here because the next button is initially disabled for ~1 second
    gui.clickButton(buttons.NextButton, 3000);
}

Controller.prototype.CredentialsPageCallback = function () {
    var login = installer.environmentVariable("QT_LOGIN");
    var password = installer.environmentVariable("QT_PASSWORD");

    if (login === "" || password === "") {
        gui.clickButton(buttons.CommitButton);
    }

    var widget = gui.currentPageWidget();
    widget.loginWidget.EmailLineEdit.setText(login);
    widget.loginWidget.PasswordLineEdit.setText(password);

    gui.clickButton(buttons.CommitButton);
}

Controller.prototype.ObligationsPageCallback = function () {
    var page = gui.pageWidgetByObjectName("ObligationsPage");
    page.obligationsAgreement.setChecked(true);
    page.completeChanged();
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.IntroductionPageCallback = function () {
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.TargetDirectoryPageCallback = function () {
    //dev is the user in our docker image
    gui.currentPageWidget().TargetDirectoryLineEdit.setText(installer.environmentVariable("QT_INSTALLPATH"));
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.PerformInstallationPageCallback = function () {
    gui.clickButton(buttons.CommitButton);
}

Controller.prototype.ComponentSelectionPageCallback = function () {
    
    // Be able to install older qt versions by selecting the archive category
    var page = gui.pageWidgetByObjectName("ComponentSelectionPage");
    var groupBox = gui.findChild(page, "CategoryGroupBox");
    if (groupBox) {
        console.log("groupBox found");
        // findChild second argument is the display name of the checkbox
        var checkBox = gui.findChild(page, "Archive");
        if (checkBox) {
            console.log("checkBox found");
            console.log("checkBox name: " + checkBox.text);
            if (checkBox.checked == false) {
                checkBox.click();
                var fetchButton = gui.findChild(page, "FetchCategoryButton");
                if (fetchButton) {
                    console.log("fetchButton found");
                    fetchButton.click();
                } else {
                    console.log("fetchButton NOT found");
                }
            }
        } else {
            console.log("checkBox NOT found");
        }
    } else {
        console.log("groupBox NOT found");
    }

    function list_packages() {
        var components = installer.components();
        console.log("Available components: " + components.length);
        var packages = ["Packages: "];
        for (var i = 0; i < components.length; i++) {
            packages.push(components[i].name);
        }
        console.log(packages.join(" "));
    }

    list_packages();

    var widget = gui.currentPageWidget();

    console.log(widget);

    widget.deselectAll();
    var packages = installer.environmentVariable("QT_PACKAGES").split(",");
    for (var i in packages) {
        widget.selectComponent(packages[i]);
    }
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.LicenseAgreementPageCallback = function () {
    gui.currentPageWidget().AcceptLicenseRadioButton.setChecked(true);
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.StartMenuDirectoryPageCallback = function () {
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.ReadyForInstallationPageCallback = function () {
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.FinishedPageCallback = function () {
    var checkBoxForm = gui.currentPageWidget().LaunchQtCreatorCheckBoxForm;
    if (checkBoxForm && checkBoxForm.launchQtCreatorCheckBox) {
        checkBoxForm.launchQtCreatorCheckBox.checked = false;
    }
    gui.clickButton(buttons.FinishButton);
}

Controller.prototype.DynamicTelemetryPluginFormCallback = function () {
    var widget = gui.currentPageWidget();
    widget.TelemetryPluginForm.statisticGroupBox.disableStatisticRadioButton.checked = true;
    gui.clickButton(buttons.NextButton);
}

Controller.prototype.ObligationsPageCallback = function()
{

    var page = gui.pageWidgetByObjectName("ObligationsPage");
    page.obligationsAgreement.setChecked(true);
    var nameEdit = gui.findChild(page, "CompanyName")
    if (nameEdit) {
        nameEdit.text = "pascom GmbH & Co. KG"
    }

    page.completeChanged();
    gui.clickButton(buttons.NextButton);
}