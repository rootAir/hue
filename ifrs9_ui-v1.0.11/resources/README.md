# IFRS9 UI INSTALL GUIDE

Install Hue

1)Download Hue version from:
https://github.com/cloudera/hue/releases/tag/release-3.11.0

2) Extract hue in the directory /opt
$ tar -xvzf hue-3.11.0.tgz

2) Rename the directory from hue-3.11.0 to ifrs9hue

3) Install Hue:
$ cd ifrs9hue/
$ make apps

4) Install paramiko:
$ ./build/env/bin/pip install paramiko



##Hue Customizations
Inside the Hue directory (ie: /opt/ifrs9hue/)

1) Copy file hue.ini inside the directory /opt/ifrs9hue/desktop/conf

2) Copy file common_header.mako inside the directory /opt/ifrs9hue/desktop/core/src/desktop/templates

3) Copy file hue3.css inside the directory /opt/ifrs9hue/desktop/core/src/desktop/static/desktop/css

4) Create directory /files_params/ inside the directory /opt/ifrs9hue/

5) Remove all languages in the file ./desktop/core/src/desktop/settings.py except es-ES,en-US and pt



## Install app
Inside the Hue directory (ie: /opt/ifrs9hue/):

1) Create IFRS9 app:

$ build/env/bin/hue create_desktop_app ifrs9_ui

2) Move the IFRS9 app inside the ifrs9_ui directory or download from the repository

$ git clone git@srvgitLab.pragsis.local:2016012IFRS9/ifrs9_ui.git


3) Install IFRS9 app in Hue:

$ build/env/bin/python tools/app_reg/app_reg.py --install ifrs9_ui --relative-paths

4) Run server:
$ build/env/bin/hue runserver 0.0.0.0:8000

5) Point to http://ip:8000/ in the browser (preferably Chrome)



## Create Hue IFRS9 users and groups

1) Logged as an admin user select the option 'Manage Users' localed in the Hue red top bar under the logged user name

2) Select the tap GROUPS located next right to the Users tab and press the button "Add group"

3) Select a name for the group (ex: ifrs9_users) and give the group two permissions: ifrs9 access (located under the letter 'I') and user admin access to profile page (located under the letter U) (Warning: be careful not to choose the first option and make the user an admin user for every user) 

4) Once the group is created, go to users admin and press the button "Add user" to add an user for this new group

5) Choose a name for the user (ex: ifrs9) and select the new group for the user instead of the default one

6) log out and log in as the new user to see the new user only sees the IFRS9 application and the user is able to edit his/her profile to change his/her language

