# Use Cases

## Manage criteria

### Requirements
- add
- display
- delete
- update

### Test plans
- add criteria, 
- check diplayed information, 
- delete some, 
- add some, 
- update some 
- then delete some updated 
- and add again

<br>

- start add and cancel (no add)
- start update and cancel (no update)


## Manage alternatives

### Requirements
- add
- display
- delete
- update

### Test plans
- add alternatives, 
- check diplayed information, 
- delete some, 
- add some, 
- update some alternatives  
- update some criteria in alternatives  
- then delete some updated 
- and add again

<br>

- start add and cancel (no add)
- start update (alternative) and cancel (no update)
- start update (criteria item in alternative) and cancel (no update)
  


## Rate and rank alternatives
(NOTE: This test also verifies "Manage criteria" and "Manage alternatives")

### Requirements
- rating
- displaying information (alternatives, criteria)
- delete information (alternatives, criteria)
- update information (alternatives, criteria)

### Test plans
- add criteria, 
- add alternatives,

<br>

- start comparision and check results,
- delete some alternatives,
- start comparision and check results,
- delete some criteria,
- start comparision and check results,
- update alternatives,
- start comparision and check results,
- update criteria
- start comparision and check results,

<br>

- add criteria,
- update alternatives (add new criteria from previous step),
- start comparision and check results,

<br>

- start comparision and check results,
- quit comparision
- start comparision and check results,
- delete all criteria
- start comparision and check results,


## Export/Import
(NOTE: This test also verifies "Manage criteria" and "Manage alternatives" and "Rate and rank alternatives")

### Requirements
- export criteria
- import criteria
- export alternatives
- import alternatives

### Test plans
- add some criteria
- export criteria
- delete some criteria
- import exported criteria

<br>

- delete some imported
- import same file
- update criteria
- import criteria

<br>

- add some criteria
- import criteria

<br>

- add some alternatives
- start comparision and check results,
  
<br>
<br>
<br>

- export alternatives
- delete some alternatives
- import exported alternatives

<br>

- delete some imported
- import same file
- update some alternatives
- import alternatives

<br>

- delete some criteria
- import alternatives
- check criteria
- delete some imported alternatives
- import same file
- check criteria
- update some imported
- update some criteria

<br>

- delete some criteria
- update some criteria
- delete some alternatives
- update some alternatives
- import alternatives
- import criteria
- start comparision and check results,

<br>

- import criteria and cancel (no import)
- import same file and cancel (no import)
- add some criteria
- update some alternatives
- start comparision and check results,

<br>

- import alternatives and cancel (no import)
- import same file and cancel (no import)
- add some alternatives
- update some criteria
- start comparision and check results,