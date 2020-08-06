#!/bin/bash -e 

#
# This script downloads the QT online installer and runs a scripted installation of it.
# It also sets up all necessary dependencies for building the pascom client on macOS.
#

if [ "$1" = "" ]
then
    BASE_DIR=`pwd`
else
    BASE_DIR=$1
fi

# # install Xcode and Homebrew, should not be necessary on CircleCI/Travis-CI?
# tar -xf .../xcode.tar /Applications
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# install dependencies
#brew install yasm wget openssl pkg-config

# offline installer, will not be available from QT 5.15 on anymore for free
# if [ -z "$QT_VERSION" ]
# then
#     QT_VERSION=5.12.7
# fi
#INSTALLER_NAME=qt-opensource-mac-x64-${QT_VERSION}
#DOWNLOAD_URL=https://download.qt.io/archive/qt/$(echo ${QT_VERSION} | cut -d "." -f -2)/${QT_VERSION}/${INSTALLER_NAME}.dmg
# online installer
INSTALLER_NAME=qt-unified-mac-x64-online
DOWNLOAD_URL=http://download.qt.io/official_releases/online_installers/${INSTALLER_NAME}.dmg
QT_DOWNLOADER=${QT_DOWNLOADER:-"wget -c -N"}

INSTALLER=${BASE_DIR}/${INSTALLER_NAME}.dmg
APPFILE=/Volumes/qt-unified-mac-x64-3.2.2-online/qt-unified-mac-x64-3.2.2-online.app/Contents/MacOS/qt-unified-mac-x64-3.2.2-online

# set envvars for QT installer automation
export QT_PACKAGES=qt.qt5.5127.clang_64
export QT_LOGIN=entwicklung@pascom.net
#export QT_PASSWORD=
export QT_INSTALLPATH=${BASE_DIR}"/Qt-"${QT_VERSION}

cd $BASE_DIR
${QT_DOWNLOADER} ${DOWNLOAD_URL} || exit 1
hdiutil attach ${INSTALLER}
${APPFILE} --script auto-install-qt.js
hdiutil detach /Volumes/qt-unified-mac-x64-3.2.2-online
rm $INSTALLER

# homebrew seems to set the active developer directory to the command line developer tools which are not enough to run our build
# might also not be necessary on CircleCI/Travis-CI?
# sudo xcode-select -r