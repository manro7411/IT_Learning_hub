import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import DashboardEN from './en/Dashboard.json';
import AdminAddLessonEN from './en/AdminAddLesson.json';
import AdminNotificationEN from './en/AdminNotification.json';
import AdminSystemLogEN from './en/AdminSystemLog.json';
import AdminTaskManagementEN from './en/AdminTaskManagement.json';
import SettingEN from './en/Setting.json';
import UserTaskEN from './en/UserTask.json';
import UserPointEN from './en/UserPoint.json';
import UserLessonEN from './en/UserLesson.json';
import UserGroupEN from './en/UserGroup.json';
import NotiWidgetEN from './en/NotiWidget.json';
import GameEN from './en/Game.json';

import DashboardTH from './th/Dashboard.json';
import AdminAddLessonTH from './th/AdminAddLesson.json';
import AdminNotificationTH from './th/AdminNotification.json';
import AdminSystemLogTH from './th/AdminSystemLog.json';
import AdminTaskManagementTH from './th/AdminTaskManagement.json';
import SettingTH from './th/Setting.json';
import UserTaskTH from './th/UserTask.json';
import UserPointTH from './th/UserPoint.json';
import UserLessonTH from './th/UserLesson.json';
import UserGroupTH from './th/UserGroup.json';
import NotiWidgetTH from './th/NotiWidget.json';
import GameTH from './th/Game.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      dashboard: DashboardEN,
      adminaddlesson: AdminAddLessonEN,
      adminnoti: AdminNotificationEN,
      adminsystemlog: AdminSystemLogEN,
      admintaskmanage: AdminTaskManagementEN,
      setting: SettingEN,
      usertask: UserTaskEN,
      userpoint: UserPointEN,
      userlesson: UserLessonEN,
      usergroup: UserGroupEN,
      notiwidget: NotiWidgetEN,
      game: GameEN
    },
    th: {
      dashboard: DashboardTH,
      adminaddlesson: AdminAddLessonTH,
      adminnoti: AdminNotificationTH,
      adminsystemlog: AdminSystemLogTH,
      admintaskmanage: AdminTaskManagementTH,
      setting: SettingTH,
      usertask: UserTaskTH,
      userpoint: UserPointTH,
      userlesson: UserLessonTH,
      usergroup: UserGroupTH,
      notiwidget: NotiWidgetTH,
      game: GameTH
      
    },
  },
  lng: 'en', // ภาษาเริ่มต้น
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
