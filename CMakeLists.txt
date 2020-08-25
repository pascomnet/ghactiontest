cmake_minimum_required(VERSION 3.5)

if(APPLE)
    #SET(MACOSX_DEPLOYMENT_TARGET ${DARWIN_MAJOR_SDK_VERSION}.${DARWIN_MINOR_SDK_VERSION})
    SET(CMAKE_CXX_FLAGS "--sysroot ${CMAKE_OSX_SYSROOT} ${CMAKE_CXX_FLAGS}")
    #MESSAGE("Setting MACOSX_DEPLOYMENT_TARGET to '${MACOSX_DEPLOYMENT_TARGET}'.")
endif()

project(ghactiontest LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_REQUIRED "YES")
set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "[Developer ID Application cert SHA-1 fingerprint]")
set(CMAKE_XCODE_ATTRIBUTE_OTHER_CODE_SIGN_FLAGS "--timestamp --options=runtime")
set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGN_INJECT_BASE_ENTITLEMENTS "NO")

# QtCreator supports the following variables for Android, which are identical to qmake Android variables.
# Check http://doc.qt.io/qt-5/deployment-android.html for more information.
# They need to be set before the find_package(Qt5 ...) call.

#if(ANDROID)
#    set(ANDROID_PACKAGE_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/android")
#    if (ANDROID_ABI STREQUAL "armeabi-v7a")
#        set(ANDROID_EXTRA_LIBS
#            ${CMAKE_CURRENT_SOURCE_DIR}/path/to/libcrypto.so
#            ${CMAKE_CURRENT_SOURCE_DIR}/path/to/libssl.so)
#    endif()
#endif()

find_package(Qt5 COMPONENTS Core Quick REQUIRED)

set(SOURCE
    main.cpp
    qml.qrc
    class1.cpp
    )

if(ANDROID)
    add_library(ghactiontest SHARED ${SOURCE})
elseif(APPLE)
    add_executable(ghactiontest MACOSX_BUNDLE ${SOURCE})
else()
    add_executable(ghactiontest ${SOURCE})
endif()

target_compile_definitions(ghactiontest
  PRIVATE $<$<OR:$<CONFIG:Debug>,$<CONFIG:RelWithDebInfo>>:QT_QML_DEBUG>)
target_link_libraries(ghactiontest
  PRIVATE Qt5::Core Qt5::Quick)

get_target_property(_qmake_executable Qt5::qmake IMPORTED_LOCATION)
get_filename_component(_qt_bin_dir "${_qmake_executable}" DIRECTORY)
find_program(MACDEPLOYQT_EXECUTABLE macdeployqt HINTS "${_qt_bin_dir}")

add_custom_command(TARGET ghactiontest POST_BUILD
    COMMAND "${MACDEPLOYQT_EXECUTABLE}" "$<TARGET_FILE_DIR:ghactiontest>/../.." "-always-overwrite" "-qmldir=${CMAKE_SOURCE_DIR}" "-verbose=2" "-codesign=[Developer ID Application cert SHA-1 fingerprint]"
    COMMENT "Running macdeployqt..."
)
