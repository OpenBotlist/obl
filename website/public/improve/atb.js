/*
     OBL - A/B SPLIT TESTER JAVASCRIPT CODE
     
     --- ABOUT ---
    * This allows us to A/B (split) test product changes we make to obl,on these test no data is collected from the user.The version of obl is randomly selected. For example, users in the A group would get blue links and users in the B group would get red links. 
    * If you close the obl and re open the window the parameter will change. as we dont use cookies on obl to save this information.
    * we use a/b tests because obl is in dev,and we have to get feedback somehow.
    * we are going to make a way to save the query (so it doesnt reset evry time you open obl.)
    * please help us improve this split tester,as we are making it from scratch.
   
    --- LICENSE --
    * This Source Code Form is subject to the terms of the GNU General Public License version 3 or
    (at your option) any later version.
    * You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
 */

// if theres no atb query
if (!/[?&]atb=/.test(location.search)) {
  // the version of obl is randomly selected. since we dont use cookies (as we said on our privacy policy),we dont save which version of obl you are using lol
  const versions = ['v63-4', 'v104-1', 'v140-2', 'v130-3'];

  // the main code that makes the a/b test go brrr

  const url = location.href; // define the url
  const random = versions[Math.floor(Math.random() * versions.length)]; // randomly get versions

  console.log(`a/b version:${random}`);

  location.href = `${url}?atb=${random}&t=${btoa(random)}`; // redirect to atb
}
