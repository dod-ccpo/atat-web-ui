# sn-hello

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
Do file replace 'x_744337' with your desired name
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Add App to Service Now ###
Open your service now personal developer instance....
1. Search for 'Retrieved Update Set', click 'Import Update Set from XML' and upload `\vue-container-servicenow.xml` from the codebase. 
2. Update and then commit the updateset.  The updateset will be committed with 'Vue App' as the name.
3. Build the app in IDE by running `npm serve build.`  
4. Search for 'vue' in ServiceNow.  The following items will appear...
   Vue Container
     UI Page
     REST API
5. Click UI Page and transfer the contents from `atat-web-ui\dist\index.html` to the HTML section.
6. Add this code to the client script section.
   ``` 	
   window.onload = function() {
    Array.prototype.forEach.call(window.parent.document.querySelectorAll("link[rel=stylesheet]"), function(link) {
        var newLink = document.createElement("link");
        newLink.rel  = link.rel;
        newLink.href = link.href;
        document.head.appendChild(newLink);
      })
    } 
   ```
7. Click Update.  
8. in the left hand nav bar, right click `Vue Container`, then `Rest API` and open the Rest API page in a new tab. 
9. Click `JS` link in the bottom resources table.
10. Click Attachment icon in the upper right hand corner. 
11. Remove any existing attachments in the modal popup.
12. Browse to the `atat-web-ui\dist\js` and upload both .js files as attachments. 
13. Return to the UI page and click the Endpoint link (in the upper hand corner).
14. A new tab opens displaying the SPA.


### To run Cypress tests on localhost

```
npm run serve
```

Open another IDE terminal window and run 

```
npx cypress open
```
### Setting Environment Variables for localhost testing

Create a `.env` file in the project's root directory and use the following Environment Variables:

| Environment Variable Name | Description          |
| ------------------------- | -------------------- |
| 'localTestUrl'            | http://localhost:8080/testing.html |
| 'isTestingLocally'        | true                |

```