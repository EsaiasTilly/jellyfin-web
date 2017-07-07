define(["globalize","loading","alert","emby-linkbutton"],function(globalize,loading,alert){"use strict";function showNewUserInviteMessage(result){if(!result.IsNewUserInvitation&&!result.IsPending)return Promise.resolve();var message=result.IsNewUserInvitation?globalize.translate("sharedcomponents#MessageInvitationSentToNewUser",result.GuestDisplayName):globalize.translate("sharedcomponents#MessageInvitationSentToUser",result.GuestDisplayName),resolvePromise=function(){return Promise.resolve()};return alert({text:message,title:globalize.translate("sharedcomponents#HeaderInvitationSent")}).then(resolvePromise,resolvePromise)}function inviteGuest(options){var apiClient=options.apiClient;return loading.show(),apiClient.ajax({type:"POST",url:apiClient.getUrl("Connect/Invite"),dataType:"json",data:options.guestOptions||{}}).then(function(result){return loading.hide(),showNewUserInviteMessage(result)},function(response){loading.hide();var rejectPromise=function(){return Promise.reject()};return 404===response.status?alert({text:globalize.translate("sharedcomponents#GuestUserNotFound")}).then(rejectPromise,rejectPromise):(response.status||0)>=500?alert({text:globalize.translate("sharedcomponents#ErrorReachingEmbyConnect")}).then(rejectPromise,rejectPromise):showGuestGeneralErrorMessage().then(rejectPromise,rejectPromise)})}function showGuestGeneralErrorMessage(){var html=globalize.translate("sharedcomponents#ErrorAddingGuestAccount1",'<a is="emby-linkbutton" class="button-link" href="https://emby.media/connect" target="_blank">https://emby.media/connect</a>');html+="<br/><br/>"+globalize.translate("sharedcomponents#ErrorAddingGuestAccount2","apps@emby.media");var text=globalize.translate("sharedcomponents#ErrorAddingGuestAccount1","https://emby.media/connect");return text+="\n\n"+globalize.translate("sharedcomponents#ErrorAddingGuestAccount2","apps@emby.media"),alert({text:text,html:html})}function showLinkUserMessage(username){var html,text;return username?(html=globalize.translate("sharedcomponents#ErrorAddingEmbyConnectAccount1",'<a is="emby-linkbutton" class="button-link" href="https://emby.media/connect" target="_blank">https://emby.media/connect</a>'),html+="<br/><br/>"+globalize.translate("sharedcomponents#ErrorAddingEmbyConnectAccount2","apps@emby.media"),text=globalize.translate("sharedcomponents#ErrorAddingEmbyConnectAccount1","https://emby.media/connect"),text+="\n\n"+globalize.translate("sharedcomponents#ErrorAddingEmbyConnectAccount2","apps@emby.media")):html=text=globalize.translate("sharedcomponents#DefaultErrorMessage"),alert({text:text,html:html})}function updateUserLink(apiClient,user,newConnectUsername){var currentConnectUsername=user.ConnectUserName||"",enteredConnectUsername=newConnectUsername,linkUrl=apiClient.getUrl("Users/"+user.Id+"/Connect/Link");return currentConnectUsername&&!enteredConnectUsername?apiClient.ajax({type:"DELETE",url:linkUrl}).then(function(){return alert({text:globalize.translate("sharedcomponents#MessageEmbyAccontRemoved"),title:globalize.translate("sharedcomponents#HeaderEmbyAccountRemoved")}).catch(function(){return Promise.resolve()})},function(){return alert({text:globalize.translate("sharedcomponents#ErrorRemovingEmbyConnectAccount")}).then(function(){return Promise.reject()})}):currentConnectUsername!==enteredConnectUsername?apiClient.ajax({type:"POST",url:linkUrl,data:{ConnectUsername:enteredConnectUsername},dataType:"json"}).then(function(result){var msgKey=result.IsPending?"sharedcomponents#MessagePendingEmbyAccountAdded":"sharedcomponents#MessageEmbyAccountAdded";return alert({text:globalize.translate(msgKey),title:globalize.translate("sharedcomponents#HeaderEmbyAccountAdded")}).catch(function(){return Promise.resolve()})},function(){return showLinkUserMessage(".").then(function(){return Promise.reject()})}):Promise.reject()}return{inviteGuest:inviteGuest,updateUserLink:updateUserLink}});