config file has database connection 
utility file has some common useful functions



ABOUT THIS APP

In this job board application, there are two usertype 
1) Jobseeker  #one who apply and find for job
2) Recruiter   #onewho create a job so seekers can apply on it

Inputformat
name / email /usertype(type 'RECRUITER' else bydefault its "CUSTOMER") are String Datatype
experiencelevel is number datatype denotes year of experience


Key features of this app:
* User autherisation and authentication has done correcctly
* JWT token is used for users authentication
* password stored in encrypted form instead of raw text for security purpose and as best practice
* Middleware is used as authorisation to keep both actor away form their functionality
* No duplicate data will create for same email
* Email should be valid formate only otherwise message will generate by validator
* pagination has done in required fileds.
* User can filter by either their experience or requiredskills
* Markdown format should be render in postman as text
* recruiter can see no. of application received on particular posted job
* recruiter and user both can modify thier documents or can delete as well

Pros:
* MVC architecture is used. 
* code is maintend properly.
* code is well organised.
* controller and router has different folder 



Nodejs, express, mongodb and many other modules used 
