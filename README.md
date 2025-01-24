	Connect Remote API Servers in LLMUNity https://github.com/undreamai/LLMUnity

	In this example im using MiniMax API for as LLM server. 

	Setup process:
	Host a NodeServer
	Configure endpoints /completion and /template
	Configure LLmCharacter.cs In Unity Inspector 
		Toggle REMOTE
		Add Host = Your NodeJS Server Host 
                port: 443 

	![image](https://github.com/user-attachments/assets/b7951504-caa5-46ba-8c16-9b680c39d6c3)



	In this example, im using Render.com to Host the NodeServer
	In this Example App.js has 4 Endpoints, /chatbot, /chat, /completion, /template
	LLMUnity uses /completion and /template
	In app.js there is a RAG feature using OpenAI Embeddings and PineCone Vector Database. C
	In App_no_rag.js there is no RAG Feature. Only endpoints. 
 

*********** BE AWARE THAT THIS EXAMPLE CODE IS NOT VERY GOOD AND MAY HAVE SOME ISSUES with the /template endpoint ***** 
