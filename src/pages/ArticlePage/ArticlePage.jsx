// import React, { useState, useEffect, useRef } from "react";
// import { apiService } from "../../assets/api/apiService";
// import { useSelector, useDispatch } from "react-redux";
// import { setDeriveInsights } from "../../redux/reducers/deriveInsights";
// import { useParams, useLocation } from "react-router-dom";
// import "./ArticlePage.css";
// import Loading from "../../components/Loading";
// import { Typography } from "@mui/material";
// import flag from "../../assets/images/flash.svg";
// import Arrow from "../../assets/images/back-arrow.svg";
// import annotate from "../../assets/images/task-square.svg";
// import { useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import { CircularProgress } from "@mui/material";
// import FileIconForDocument from "../../assets/images/FileIconforDocument.svg";
// import Annotation from "../../components/Annotaions";
// import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
// import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
// import notesicon from "../../assets/images/note-2.svg";
// import rehypeRaw from "rehype-raw";
// import newChat from "../../assets/images/20px@2x.svg";
// import pen from "../../assets/images/16px.svg";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTelegram } from "@fortawesome/free-brands-svg-icons";
// import { LiaTelegramPlane } from "react-icons/lia";
// import Notes from "../NotesPage/Notes";
// import { showErrorToast, showSuccessToast } from "../../utils/toastHelper";
// import { faTimes, faAnglesUp } from "@fortawesome/free-solid-svg-icons";
// import upload from "../../assets/images/upload-file.svg";
// import Header from "../../components/Header-New";

// import uploadDocx from "../../assets/images/uploadDocx.svg";
// const ArticlePage = () => {
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const deriveInsights = useSelector((state) => state.deriveInsights?.active); // assuming deriveInsights is in Redux state

//   const displayIfLoggedIn = isLoggedIn ? null : "none";
//   const widthIfLoggedIn = isLoggedIn ? null : "80%";
//   const heightIfLoggedIn = isLoggedIn ? null : "80vh";
//   const { pmid } = useParams();
//   const { user } = useSelector((state) => state.auth);
//   const token = useSelector((state) => state.auth.access_token);
//   const dispatch = useDispatch();
//   const user_id = user?.user_id;
//   const [type, id1] = pmid ? pmid.split(":") : "";
//   const id = Number(id1);
//   const [source, setSource] = useState();
//   const [annotateLoading, setAnnotateLoading] = useState(false);
//   const location = useLocation();
//   const { data } = location.state || { data: [] };
//   const [searchTerm, setSearchTerm] = useState("");
//   const [articleData, setArticleData] = useState(null);
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [searchCollection, setSearchCollection] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [annotateData, setAnnotateData] = useState(
//     location.state?.annotateData || ""
//   );
//   const endOfMessagesRef = useRef(null);
//   const [chatHistory, setChatHistory] = useState(() => {
//     const storedHistory = localStorage.getItem("chatHistory");
//     return storedHistory ? JSON.parse(storedHistory) : [];
//   });
//   const [refreshSessions, setRefreshSessions] = useState(false);
//   useEffect(() => {
//     // Retrieve chat history from sessionStorage
//     const storedChatHistory = localStorage.getItem("chatHistory");

//     if (storedChatHistory) {
//       // Parse the chat history string back into an array
//       setChatHistory(JSON.parse(storedChatHistory));
//       setShowStreamingSection(true);
//     }
//   }, []);
//   useEffect(() => {
//     if (annotateLoading) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [annotateLoading]);
//   const [showStreamingSection, setShowStreamingSection] = useState(false);
//   const [openAnnotate, setOpenAnnotate] = useState(false);
//   const [openNotes, setOpenNotes] = useState(false);
//   const [activeSessionId, setActiveSessionId] = useState(
//     sessionStorage.getItem("session_id") || null
//   );
//   const isOnArticlePage = location.pathname === "/article";
//   const contentRef = useRef(null); // Ref to target the content div
//   const [contentWidth, setContentWidth] = useState(); // State for content width
//   const [ratingsList, setRatingsList] = useState(() => {
//     return JSON.parse(sessionStorage.getItem("ratingsGiven")) || [];
//   });
//   const [triggerAskClick, setTriggerAskClick] = useState(false);
//   const [triggerDeriveClick, setTriggerDeriveClick] = useState(false);
//   const [editedTitle, setEditedTitle] = useState("");
//   const [articleTitle, setArticleTitle] = useState("");
//   const [collections, setCollections] = useState([]);
//   const [showConfirmPopup, setShowConfirmPopup] = useState(false);
//   const [showConfirmIcon, setShowConfirmIcon] = useState(false);
//   const [isPromptEnabled, setIsPromptEnabled] = useState(false);

//   const fetchCollections = async () => {
//     try {
//       const response = await apiService.fetchCollections(user_id, token);
//       if (response.data) {
//         setCollections(response.data.collections);
//         if (response.data.collections.length > 0) {
//           localStorage.setItem(
//             "collections",
//             JSON.stringify(response.data.collections)
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching collections:", error);
//     }
//   };

//   useEffect(() => {
//     if (user_id && token) {
//       fetchCollections();
//     }
//   }, [user_id, token]);

//   const [currentid, setCurrentid] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newCollectionName, setNewCollectionName] = useState("");
//   const [hasFetchedAnnotateData, setHasFetchedAnnotateData] = useState(false);
//   const [sessions, setSessions] = useState([]);
//   const [editingSessionId, setEditingSessionId] = useState(null);
//   const [savedText, setSavedText] = useState("");
//   const selectedTextRef = useRef("");
//   const popupRef = useRef(null);
//   const popupPositionRef = useRef({ x: 0, y: 0 });
//   // const [annotateHeight, setAnnotateHeight] = useState(0);
//   // const [notesHeight, setNotesHeight] = useState(0);
//   // const minHeight = 0;
//   // const maxHeight = 0;
//   useEffect(() => {
//     if (!openNotes) {
//       setSavedText("");
//     }
//   }, [openNotes]);

//   // useEffect(() => {
//   //   if (openAnnotate && !openNotes) {
//   //     setAnnotateHeight(0);
//   //     console.log("height is 50vh");
//   //     setNotesHeight(0);
//   //   } else if (openNotes && !openAnnotate) {
//   //     setNotesHeight(0);
//   //     setAnnotateHeight(0);
//   //   } else {
//   //     setAnnotateHeight(0);
//   //     setNotesHeight(0);
//   //   }
//   // }, [openAnnotate, openNotes]);

//   useEffect(() => {
//     if (type === "bioRxiv_id") {
//       setSource("biorxiv");
//     } else if (type === "pmid") {
//       setSource("pubmed");
//     } else if (type === "plos_id") {
//       setSource("plos");
//     }
//   }, [type]);

//   useEffect(() => {
//     if (user_id && token) {
//       fetchCollections();
//     }
//   }, [user_id, token]);

//   useEffect(() => {
//     if (source && id && !deriveInsights) {
//       setAnnotateLoading(true);
//       const fetchArticleData = async () => {
//         try {
//           const response = await apiService.fetchArticleData(id, source, token);
//           const article = response.data;
//           setArticleData(article);
//           setAnnotateLoading(false);

//           // Retrieve and set saved search term from sessionStorage
//           const savedTerm = sessionStorage.getItem("SearchTerm");
//           setSearchTerm(savedTerm);
//         } catch (error) {
//           setAnnotateLoading(false);
//           console.error("Error fetching article data:", error);
//         }
//       };

//       fetchArticleData();
//     }
//   }, [id, source, token, deriveInsights]);

//   // const handleAnnotateResize = (e) => {
//   //   if (openAnnotate && openNotes) {
//   //     e.preventDefault();
//   //     const startY = e.clientY;
//   //     const startHeight = annotateHeight;

//   //     const onMouseMove = (moveEvent) => {
//   //       const delta = ((moveEvent.clientY - startY) / window.innerHeight) * 100;
//   //       const newAnnotateHeight = Math.max(
//   //         minHeight,
//   //         Math.min(maxHeight, startHeight + delta)
//   //       );
//   //       const newNotesHeight = 60 - newAnnotateHeight;

//   //       setAnnotateHeight(newAnnotateHeight);
//   //       setNotesHeight(newNotesHeight);
//   //     };

//   //     const onMouseUp = () => {
//   //       window.removeEventListener("mousemove", onMouseMove);
//   //       window.removeEventListener("mouseup", onMouseUp);
//   //     };

//   //     window.addEventListener("mousemove", onMouseMove);
//   //     window.addEventListener("mouseup", onMouseUp);
//   //   }
//   // };

//   // const handleNotesResize = (e) => {
//   //   if (openAnnotate && openNotes) {
//   //     e.preventDefault();
//   //     const startY = e.clientY;
//   //     const startHeight = notesHeight;

//   //     const onMouseMove = (moveEvent) => {
//   //       const delta = ((startY - moveEvent.clientY) / window.innerHeight) * 100;
//   //       const newNotesHeight = Math.max(
//   //         minHeight,
//   //         Math.min(maxHeight, startHeight + delta)
//   //       );
//   //       const newAnnotateHeight = Math.max(minHeight, 60 - newNotesHeight);

//   //       setNotesHeight(newNotesHeight);
//   //       setAnnotateHeight(newAnnotateHeight);
//   //     };

//   //     const onMouseUp = () => {
//   //       window.removeEventListener("mousemove", onMouseMove);
//   //       window.removeEventListener("mouseup", onMouseUp);
//   //     };

//   //     window.addEventListener("mousemove", onMouseMove);
//   //     window.addEventListener("mouseup", onMouseUp);
//   //   }
//   // };

//   useEffect(() => {
//     // Access the computed width of the content div
//     if (contentRef.current) {
//       const width = contentRef.current.offsetWidth;
//       setContentWidth(`${width}px`);
//     }
//   }, [openAnnotate]);
//   useEffect(() => {
//     // Access the computed width of the content div
//     if (contentRef.current) {
//       const width = contentRef.current.offsetWidth;
//       setContentWidth(`${width}px`);
//     }
//   }, [openNotes]);

//   const handleRatingChange = async (uniqueId, newRating) => {
//     // Ensure ratingsList is an array
//     const currentRatings = Array.isArray(ratingsList) ? ratingsList : [];

//     // Create a copy of ratingsList
//     const updatedRatings = [...currentRatings];

//     const existingRatingIndex = updatedRatings.findIndex(
//       (item) => item.uniqueId === uniqueId
//     );

//     if (existingRatingIndex !== -1) {
//       updatedRatings[existingRatingIndex].rating = newRating;
//     } else {
//       updatedRatings.push({ uniqueId, rating: newRating });
//     }

//     setRatingsList(updatedRatings);
//     sessionStorage.setItem("ratingsGiven", JSON.stringify(updatedRatings));

//     // Extract source and article_id from uniqueId
//     const [article_source, article_id] = uniqueId.split("_");

//     try {
//       await apiService.ratingChange(
//         user_id,
//         article_source,
//         newRating,
//         article_id,
//         token
//       );
//     } catch (error) {
//       console.error("Error saving rating:", error);
//     }
//   };
//   const handleMouseUp = (event) => {
//     if (!contentRef.current || !contentRef.current.contains(event.target)) {
//       return;
//     }

//     const selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const selectedText = selection.toString().trim();

//       if (selectedText) {
//         const rects = range.getClientRects();
//         const lastRect = rects[rects.length - 1];
//         if (lastRect) {
//           selectedTextRef.current = selectedText;
//           popupPositionRef.current = {
//             x: lastRect.right + window.scrollX,
//             y: lastRect.bottom + window.scrollY,
//           };

//           if (popupRef.current) {
//             popupRef.current.style.left = `${popupPositionRef.current.x}px`;
//             popupRef.current.style.top = `${popupPositionRef.current.y + 5}px`;
//             popupRef.current.style.display = "block";
//           }
//         } else {
//           if (popupRef.current) {
//             popupRef.current.style.display = "none";
//           }
//         }
//       } else {
//         if (popupRef.current) {
//           popupRef.current.style.display = "none";
//         }
//       }
//     }
//   };

//   const isArticleBookmarked = (idType) => {
//     const numericIdType = Number(idType);
//     for (const [collectionName, articleArray] of Object.entries(collections)) {
//       const found = articleArray.some(
//         (article) => Number(article.article_id) === numericIdType
//       );

//       if (found) {
//         return { isBookmarked: true, collectionName };
//       }
//     }
//     return { isBookmarked: false, collectionName: null };
//   };

//   const handleBookmarkClick = async (idType, title, source) => {
//     const { isBookmarked, collectionName } = isArticleBookmarked(idType);

//     if (isBookmarked) {
//       try {
//         const response = await apiService.bookmarkClick(
//           user_id,
//           collectionName,
//           idType,
//           token
//         );
//         if (response.status === 200) {
//           const updatedCollections = {
//             ...collections,
//             [collectionName]: collections[collectionName].filter(
//               (article) => article.article_id !== String(idType)
//             ),
//           };

//           setCollections(updatedCollections);
//           localStorage.setItem(
//             "collections",
//             JSON.stringify(updatedCollections)
//           );
//           showSuccessToast("Bookmark unsaved successfully");

//           await fetchCollections();
//         }
//       } catch (error) {
//         console.error("Error deleting bookmark:", error);
//       }
//     } else {
//       setCurrentid(idType);
//       setArticleTitle(title);
//       setSource(source);
//       setIsModalOpen(true);
//     }
//   };

//   const handleSaveToExisting = async (collectionName) => {
//     const bookmarkData = {
//       user_id,
//       collection_name: collectionName,
//       bookmark: {
//         article_id: String(currentid),
//         article_title: articleTitle,
//         article_source: source,
//       },
//     };

//     try {
//       const response = await apiService.saveToExisting(bookmarkData, token);
//       if (response.status === 201) {
//         const updatedCollections = {
//           ...collections,
//           [collectionName]: [
//             ...(collections[collectionName] || []),
//             {
//               article_id: String(currentid),
//               article_title: articleTitle,
//               article_source: source,
//             },
//           ],
//         };

//         setCollections(updatedCollections);
//         localStorage.setItem("collections", JSON.stringify(updatedCollections));
//         showSuccessToast("Added to Existing Collection");

//         await fetchCollections();

//         setIsModalOpen(false);
//       }
//     } catch (error) {
//       showErrorToast("Failed to Add to the collection");
//       console.error("Error adding bookmark to existing collection:", error);
//     }
//   };

//   const handleCreateNewCollection = async () => {
//     const newCollection = {
//       user_id,
//       collection_name: newCollectionName,
//       bookmark: {
//         article_id: String(currentid),
//         article_title: articleTitle,
//         article_source: source,
//       },
//     };

//     try {
//       const response = await apiService.createNewCollection(
//         newCollection,
//         token
//       );
//       if (response.status === 201) {
//         showSuccessToast("Collection Created");
//         await fetchCollections();
//         setNewCollectionName("");
//         setIsModalOpen(false);
//       }
//     } catch (error) {
//       showErrorToast("Failed to CreateCollection");
//       console.error("Error creating new collection:", error);
//     }
//   };

//   const handleSaveToNote = () => {
//     const textToSave = selectedTextRef.current;
//     if (textToSave) {
//       setSavedText(textToSave);
//       // You can save the text to notes or perform any other action here.
//     }
//     if (!openNotes) {
//       setOpenNotes(true);
//     }

//     // Hide the popup after saving
//     if (popupRef.current) {
//       popupRef.current.style.display = "none";
//     }
//   };
//   useEffect(() => {
//     document.addEventListener("mouseup", handleMouseUp);
//     sessionStorage.setItem("session_id", "");
//     // localStorage.setItem("chatHistory", []);
//     return () => {
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, []);

//   const getid = () => {
//     return `${source}_${id}`;
//   };

//   const uniqueId = getid();

//   useEffect(() => {
//     const articleContent = document.querySelector(".meta");
//     const handleScroll = () => {
//       if (articleContent.scrollTop > 20) {
//         document.getElementById("scrollTopBtn").style.display = "block"; // Show the button
//       } else {
//         document.getElementById("scrollTopBtn").style.display = "none"; // Hide the button
//       }
//     };

//     // Attach the scroll event listener to .article-content
//     if (articleContent) {
//       articleContent.addEventListener("scroll", handleScroll);
//     }

//     // Clean up event listener on component unmount
//     return () => {
//       if (articleContent) {
//         articleContent.removeEventListener("scroll", handleScroll);
//       }
//     };
//   });

//   function scrollToTop() {
//     const articleContent = document.querySelector(".meta");
//     if (articleContent) {
//       articleContent.scrollTo({
//         top: 0,
//         behavior: "smooth", // This will create the smooth scrolling effect
//       });
//     }
//   }

//   useEffect(() => {
//     // Scroll to the bottom whenever chat history is updated
//     if (endOfMessagesRef.current) {
//       endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatHistory]); // This will trigger when chatHistory changes

//   const handleAskClick = async () => {
//     if (!query) {
//       showErrorToast("Please enter a query");
//       return;
//     }

//     setShowStreamingSection(true);
//     setLoading(true);

//     const newChatEntry = { query, response: "", showDot: true };
//     setChatHistory((prevChatHistory) => [...prevChatHistory, newChatEntry]);

//     // Create a unique key for the session based on the source and article id
//     const sessionKey = `${source}_${id}`;
//     const storedSessionId =
//       JSON.parse(sessionStorage.getItem("articleSessions"))?.[sessionKey] || "";

//     const bodyData = JSON.stringify({
//       question: query,
//       user_id: user_id,
//       session_id: storedSessionId || undefined, // Use stored session_id if available
//       source: source,
//       article_id: Number(id),
//     });

//     try {
//       const response = await fetch(
//         "https://inferai.ai/api/view_article/generateanswer",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Add the Bearer token here
//           },
//           body: bodyData,
//         }
//       );
//       // console.log("API Response:", response);

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";
//       setQuery("");

//       const readStream = async () => {
//         let done = false;
//         const delay = 100; // Delay between words

//         while (!done) {
//           const { value, done: streamDone } = await reader.read();
//           done = streamDone;

//           if (value) {
//             buffer += decoder.decode(value, { stream: true });

//             while (buffer.indexOf("{") !== -1 && buffer.indexOf("}") !== -1) {
//               let start = buffer.indexOf("{");
//               let end = buffer.indexOf("}", start);
//               if (start !== -1 && end !== -1) {
//                 const jsonChunk = buffer.slice(start, end + 1);
//                 buffer = buffer.slice(end + 1);

//                 try {
//                   const parsedData = JSON.parse(jsonChunk);
//                   // console.log("Received Data Chunk:", parsedData); // Log each parsed data chunk

//                   // Store session_id for the specific article and source in sessionStorage if it exists
//                   if (parsedData.session_id) {
//                     const articleSessions =
//                       JSON.parse(sessionStorage.getItem("articleSessions")) ||
//                       {};
//                     articleSessions[sessionKey] = parsedData.session_id; // Store session_id under source_id key
//                     sessionStorage.setItem(
//                       "articleSessions",
//                       JSON.stringify(articleSessions)
//                     );
//                   }

//                   const answer = parsedData.answer;
//                   const words = answer.split(" ");

//                   for (const word of words) {
//                     await new Promise((resolve) => setTimeout(resolve, delay));

//                     setChatHistory((chatHistory) => {
//                       const updatedChatHistory = [...chatHistory];
//                       const lastEntryIndex = updatedChatHistory.length - 1;

//                       if (lastEntryIndex >= 0) {
//                         updatedChatHistory[lastEntryIndex] = {
//                           ...updatedChatHistory[lastEntryIndex],
//                           response:
//                             (updatedChatHistory[lastEntryIndex].response ||
//                               "") +
//                             " " +
//                             word,
//                           showDot: true,
//                         };
//                       }

//                       return updatedChatHistory;
//                     });

//                     setResponse((prev) => prev + " " + word);

//                     if (endOfMessagesRef.current) {
//                       endOfMessagesRef.current.scrollIntoView({
//                         behavior: "smooth",
//                       });
//                     }
//                   }
//                   setChatHistory((chatHistory) => {
//                     const updatedChatHistory = [...chatHistory];
//                     const lastEntryIndex = updatedChatHistory.length - 1;
//                     if (lastEntryIndex >= 0) {
//                       updatedChatHistory[lastEntryIndex].showDot = false;
//                     }
//                     return updatedChatHistory;
//                   });
//                 } catch (error) {
//                   console.error("Error parsing JSON chunk:", error);
//                 }
//               }
//             }
//           }
//         }
//         setRefreshSessions((prev) => !prev);
//         setLoading(false);
//         localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
//       };

//       readStream();
//     } catch (error) {
//       console.error("Error fetching or reading stream:", error);
//       setLoading(false);
//     }
//   };

//   const handlePromptClick = (queryText) => {
//     setQuery(queryText);
//     setTriggerAskClick(true);
//   };
//   useEffect(() => {
//     if (triggerAskClick) {
//       handleAskClick();
//       setTriggerAskClick(false); // Reset the flag after handling the click
//     }
//   }, [query, triggerAskClick]);
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleAskClick();
//     }
//   };
//   const storedSessionId =
//     sessionStorage.getItem("sessionId") || sessionStorage.getItem("session_id");
//   const handleDeriveClick = async () => {
//     if (!query && !uploadedFile) {
//       showErrorToast("Please enter a query or upload a file", {
//         position: "top-center",
//         autoClose: 2000,
//       });

//       return;
//     }
//     removeUploadedFile();
//     setQuery("");
//     setLoading(true);
//     const newChatEntry = {
//       query,
//       file: uploadedFile,
//       response: "",
//       showDot: true,
//     };
//     setChatHistory((prevChatHistory) => [...prevChatHistory, newChatEntry]);

//     try {
//       let url = "https://inferai.ai/api/insights/upload";
//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "ngrok-skip-browser-warning": true,
//       };
//       console.log(storedSessionId);
//       // Initialize FormData
//       const formData = new FormData();
//       formData.append("question", query);

//       // Conditionally set user_id or userid based on session_id existence
//       if (storedSessionId) {
//         formData.append("user_id", user.user_id);
//         formData.append("session_id", storedSessionId);
//       } else {
//         formData.append("userid", user.user_id);
//       }

//       if (uploadedFile) {
//         formData.append("file", uploadedFile);
//       }

//       if (storedSessionId) {
//         url = "https://inferai.ai/api/insights/ask";
//       }
//       console.log(storedSessionId);
//       // Use fetch instead of axios to handle streaming response
//       const response = await fetch(url, {
//         method: "POST",
//         headers: headers,
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Network response was not ok");

//       // Stream response and update chat history
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";
//       let apiResponse = ""; // To accumulate the full response

//       const readStream = async () => {
//         let done = false;
//         const delay = 100;

//         while (!done) {
//           const { value, done: streamDone } = await reader.read();
//           done = streamDone;

//           if (value) {
//             buffer += decoder.decode(value, { stream: true });

//             // Process chunks of JSON-like data
//             while (buffer.indexOf("{") !== -1 && buffer.indexOf("}") !== -1) {
//               let start = buffer.indexOf("{");
//               let end = buffer.indexOf("}", start);
//               if (start !== -1 && end !== -1) {
//                 const jsonChunk = buffer.slice(start, end + 1);
//                 buffer = buffer.slice(end + 1);

//                 try {
//                   const parsedData = JSON.parse(jsonChunk);
//                   const answer = parsedData.answer;
//                   apiResponse += answer + " "; // Accumulate the full response

//                   // Store session_id if not already stored
//                   if (!storedSessionId && parsedData.session_id) {
//                     // setSessionId(parsedData.session_id);
//                     sessionStorage.setItem("session_id", parsedData.session_id);
//                   }

//                   setChatHistory((chatHistory) => {
//                     const updatedChatHistory = [...chatHistory];
//                     const lastEntryIndex = updatedChatHistory.length - 1;
//                     if (lastEntryIndex >= 0) {
//                       updatedChatHistory[lastEntryIndex] = {
//                         ...updatedChatHistory[lastEntryIndex],
//                         response: apiResponse.trim(),
//                         showDot: false,
//                       };
//                     }
//                     return updatedChatHistory;
//                   });

//                   if (endOfMessagesRef.current) {
//                     endOfMessagesRef.current.scrollIntoView({
//                       behavior: "smooth",
//                       // block: "end",
//                     });
//                   }
//                 } catch (error) {
//                   console.error("Error parsing JSON chunk:", error);
//                 }
//               }
//             }
//           }
//         }
//         setRefreshSessions((prev) => !prev);
//         setLoading(false);
//         localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
//       };

//       readStream();
//     } catch (error) {
//       console.error("Error fetching or reading stream:", error);
//       setLoading(false);
//     }
//   };

//   const handlePromptWithFile = (prompt) => {
//     if (!uploadedFile && !storedSessionId) return; // Ensure either a file is selected or a session exists

//     setQuery(prompt);
//     setTriggerDeriveClick(true);
//     // handleDeriveClick(prompt, uploadedFile);
//     // setQuery(prompt); // Set the prompt as the query
//     // handleDeriveClick(); // Immediately trigger derive click with file and prompt
//   };
//   useEffect(() => {
//     if (triggerDeriveClick) {
//       handleDeriveClick();
//       setTriggerDeriveClick(false); // Reset the flag after handling the click
//     }
//   }, [query, triggerDeriveClick]);
//   const handleDeriveKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleDeriveClick();
//     }
//   };
//   const handleBackClick = () => {
//     const unsavedChanges = localStorage.getItem("unsavedChanges");
//     if (unsavedChanges === "true") {
//       setShowConfirmPopup(true);
//       //navigate(-1);
//     } else {
//       navigate(-1);
//     }
//   };

//   const handleCancelConfirm = () => {
//     setShowConfirmPopup(false);
//   };
//   const handleOk = () => {
//     setShowConfirmPopup(false);
//     localStorage.removeItem("unsavedChanges");
//     navigate(-1);
//   };

//   const boldTerm = (text) => {
//     if (typeof text !== "string") {
//       return JSON.stringify(text);
//     }

//     if (!searchTerm) return text;

//     // Create a regex to find the search term
//     const regex = new RegExp(`(${searchTerm})`, "gi");

//     // Replace the search term in the text with markdown bold syntax
//     return text.replace(regex, "**$1**");
//   };
//   const handleAnnotate = () => {
//     // Replace `desiredId` with the actual ID you want to match against
//     const matchingIdExists =
//       annotateData && Object.prototype.hasOwnProperty.call(annotateData, id);
//     if ((!annotateData || !matchingIdExists) && !hasFetchedAnnotateData) {
//       handleAnnotateClick();
//     } else {
//       setOpenAnnotate((prevOpenAnnotate) => !prevOpenAnnotate); // Open immediately if matching ID is present
//     }
//   };

//   const handleAnnotateClick = async () => {
//     // Define the request body according to source and id
//     let requestBody = {};
//     if (source === "pubmed" && id) {
//       requestBody = { pubmed: [id] };
//     } else if (source === "biorxiv" && id) {
//       requestBody = { biorxiv: [id] };
//     } else if (source === "plos" && id) {
//       requestBody = { plos: [id] };
//     }

//     setAnnotateLoading(true);
//     try {
//       const response = await apiService.annotateClick(requestBody, token);
//       const data = response.data;
//       setAnnotateData(data);
//       setHasFetchedAnnotateData(true); // Set flag after successful fetch
//       setOpenAnnotate(true); // Open annotation panel after data is received
//     } catch (error) {
//       console.error("Error fetching data from the API", error);
//     } finally {
//       setAnnotateLoading(false);
//     }
//   };

//   // Optional: useEffect for clearing flag if needed, such as when sources change
//   useEffect(() => {
//     if (!annotateData) {
//       setHasFetchedAnnotateData(false);
//     }
//   }, [annotateData, source, id]);

//   const handleNotes = () => {
//     const unsavedforIcon = localStorage.getItem("unsavedChanges");
//     if (unsavedforIcon === "true") {
//       setShowConfirmIcon(true);
//     } else {
//       setOpenNotes((prevOpenNotes) => !prevOpenNotes);
//     }
//   };
//   const handleCancelIcon = () => {
//     setShowConfirmIcon(false);
//   };
//   const handleCloseIcon = () => {
//     setShowConfirmIcon(false);
//     setOpenNotes(false);
//     localStorage.removeItem("unsavedChanges");
//   };
//   // Dynamically render the nested content in order, removing numbers, and using keys as side headings
//   // Helper function to capitalize the first letter of each word
//   const capitalizeFirstLetter = (text) => {
//     return text.replace(/\b\w/g, (char) => char.toUpperCase());
//   };
//   const MyMarkdownComponent = ({ markdownContent, handleMouseUp }) => {
//     return (
//       <div onMouseUp={handleMouseUp}>
//         <ReactMarkdown
//           rehypePlugins={[rehypeRaw]} // Enables HTML parsing
//         >
//           {markdownContent}
//         </ReactMarkdown>
//       </div>
//     );
//   };

//   const renderContentInOrder = (content, isAbstract = false) => {
//     const sortedKeys = Object.keys(content).sort(
//       (a, b) => parseInt(a) - parseInt(b)
//     );
//     return sortedKeys.map((sectionKey) => {
//       const sectionData = content[sectionKey];
//       const cleanedSectionKey = sectionKey.replace(/^\d+[:.]?\s*/, "");
//       if (cleanedSectionKey.toLowerCase() === "paragraph") {
//         const textContent =
//           typeof sectionData === "string"
//             ? sectionData
//             : JSON.stringify(sectionData);
//         const boldtextContent = boldTerm(textContent);

//         return (
//           <div key={sectionKey} style={{ marginBottom: "10px" }}>
//             <MyMarkdownComponent markdownContent={boldtextContent} />
//           </div>
//         );
//       }
//       // Handle keywords
//       if (cleanedSectionKey.toLowerCase() === "keywords") {
//         let keywords = Array.isArray(sectionData)
//           ? sectionData.join(", ")
//           : sectionData;
//         keywords = capitalizeFirstLetter(keywords);
//         const boldKeywords = boldTerm(keywords);

//         return (
//           <div key={sectionKey} style={{ marginBottom: "10px" }}>
//             <Typography variant="h6" style={{ fontSize: "18px" }}>
//               Keywords
//             </Typography>
//             <Typography variant="body1">{boldKeywords}</Typography>
//           </div>
//         );
//       }

//       // Handle nested objects or other content
//       if (typeof sectionData === "object") {
//         return (
//           <div key={sectionKey} style={{ marginBottom: "20px" }}>
//             <Typography variant="h6" style={{ fontSize: "18px" }}>
//               {capitalizeFirstLetter(cleanedSectionKey)}
//             </Typography>
//             {renderContentInOrder(sectionData)}
//           </div>
//         );
//       } else {
//         const textContent =
//           typeof sectionData === "string"
//             ? sectionData
//             : JSON.stringify(sectionData);
//         const boldtextContent = boldTerm(textContent);

//         return (
//           <div key={sectionKey} style={{ marginBottom: "10px" }}>
//             <Typography variant="h6" style={{ fontSize: "18px" }}>
//               {capitalizeFirstLetter(cleanedSectionKey)}
//             </Typography>
//             <MyMarkdownComponent markdownContent={boldtextContent} />
//           </div>
//         );
//       }
//     });
//   };

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await apiService.fetchSessions(user_id, token);
//         if (response.data?.sessions) {
//           const sessionsData = response.data.sessions.reverse();
//           setSessions(sessionsData);
//         }
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     if (user_id && token) {
//       fetchSessions();
//     }
//   }, [user_id, token, refreshSessions]);

//   // Edit functions
//   const handleEditClick = (sessionId, title) => {
//     setEditingSessionId(sessionId);
//     setEditedTitle(title);
//   };

//   const handleTitleChange = (e) => {
//     setEditedTitle(e.target.value); // Update the state as the user types
//   };

//   const handleSaveEdit = async (sessionId) => {
//     try {
//       await apiService.saveEdit(token, {
//         user_id,
//         session_id: sessionId,
//         new_title: editedTitle,
//       });
//       setSessions((prevSessions) =>
//         prevSessions.map((session) =>
//           session.session_id === sessionId
//             ? { ...session, session_title: editedTitle }
//             : session
//         )
//       );

//       // Reset editing state
//       setEditingSessionId(null);
//       setEditedTitle("");
//     } catch (error) {
//       console.error("Error updating session title:", error);
//     }
//   };

//   useEffect(() => {
//     // Retrieve chat history from sessionStorage on component mount or on location state change
//     const storedChatHistory = localStorage.getItem("chatHistory");

//     if (storedChatHistory) {
//       setChatHistory(JSON.parse(storedChatHistory));
//       setShowStreamingSection(true);
//     } else {
//       setShowStreamingSection(false); // Default to false if no stored chat history
//     }
//   }, [location.state]); // Add location.state as a dependency to re-run on navigation
//   console.log(source);
//   const handleSessionClick = async (session_id) => {
//     try {
//       const conversationResponse = await apiService.sessionClick(
//         user_id,
//         session_id,
//         token
//       );
//       sessionStorage.setItem("session_id", session_id);
//       setIsPromptEnabled(true);

//       setActiveSessionId(session_id);
//       const formattedChatHistory = [];
//       let currentEntry = {};

//       // Process conversation data into chat history
//       conversationResponse.data.conversation.forEach((entry) => {
//         if (entry.role === "user") {
//           if (entry.file_url) {
//             currentEntry.file_url = entry.file_url;
//           }

//           if (currentEntry.query) {
//             formattedChatHistory.push(currentEntry);
//             currentEntry = {};
//           }
//           currentEntry.query = entry.parts.join(" ");
//         } else if (entry.role === "model") {
//           currentEntry.response = entry.parts.join(" ");
//           formattedChatHistory.push(currentEntry);
//           currentEntry = {};
//         }
//       });

//       if (currentEntry.query) {
//         formattedChatHistory.push(currentEntry);
//       }

//       localStorage.setItem("chatHistory", JSON.stringify(formattedChatHistory));

//       const sourceType =
//         conversationResponse.data.source === "biorxiv"
//           ? "bioRxiv_id"
//           : conversationResponse.data.source === "plos"
//           ? "plos_id"
//           : "pmid";

//       const navigatePath = conversationResponse.data.session_type
//         ? "/article"
//         : `/article/${sourceType}:${conversationResponse.data.article_id}`;

//       if (conversationResponse.data.session_type) {
//         // Navigate immediately if deriveInsights mode
//         dispatch(setDeriveInsights(true));
//         console.log(navigatePath);
//         navigate(navigatePath, {
//           state: {
//             id: conversationResponse.data.article_id || id,
//             source: source,
//             token: token,
//             user: { access_token: token, user_id: user_id },
//             annotateData: location.state?.annotateData,
//             data: location.state?.data,
//           },
//         });
//       } else {
//         console.log("nav");
//         dispatch(setDeriveInsights(false));

//         console.log(navigatePath);

//         navigate(navigatePath, {
//           state: {
//             id: conversationResponse.data.article_id || id,
//             source: source,
//             token: token,
//             user: { access_token: token, user_id: user_id },
//             annotateData: location.state?.annotateData,
//             data: location.state?.data,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching article or conversation data:", error);
//     }
//   };

//   useEffect(() => {
//     const storedSessionId = sessionStorage.getItem("session_id");
//     if (storedSessionId) {
//       setActiveSessionId(storedSessionId);
//     }
//   }, [sessions]);

//   const [uploadedFile, setUploadedFile] = useState(null);
//   useEffect(() => {
//     const storedSessionId =
//       sessionStorage.getItem("sessionId") ||
//       sessionStorage.getItem("session_id");
//     console.log("exec");
//     if (storedSessionId || uploadedFile) {
//       setIsPromptEnabled(true); // Enable prompts if session_id exists or a file is uploaded
//     } else {
//       setIsPromptEnabled(false); // Disable prompts if neither session_id nor file is present
//     }
//   }, [handleDeriveClick, uploadedFile]);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return; // Exit if no file was selected
//     if (file.size > 5 * 1024 * 1024) {
//       showErrorToast("try uploading files 5MB or less", {
//         position: "top-center",
//       });
//     }

//     const allowedExtensions = ["pdf", "docx"];
//     const fileExtension = file.name.split(".").pop().toLowerCase();

//     if (!allowedExtensions.includes(fileExtension)) {
//       //alert("Please upload a PDF or DOCX file.");
//       showErrorToast("try uploading .pdf,.docx", {
//         position: "top-center",
//         autoClose: 2000,
//       });
//       return;
//     }

//     setUploadedFile(file); // Proceed if the file type is valid
//     setIsPromptEnabled(true);
//   };

//   const removeUploadedFile = () => {
//     setUploadedFile(null);
//     setIsPromptEnabled(false);
//   };
//   const handleUploadClick = () => {
//     document.getElementById("file-upload").click();
//   };

//   const handleOpenChat = () => {
//     localStorage.removeItem("session_id");
//     localStorage.setItem("chatHistory", []);
//     setArticleData("");
//     setChatHistory([]);
//     dispatch(setDeriveInsights(true)); // Set deriveInsights state in Redux
//     // console.log("clicked");
//     navigate("/article", {
//       state: true, // Set state to null
//     });
//   };

//   const [isDragging, setIsDragging] = useState(false);

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setIsDragging(false);
//     const file = event.dataTransfer.files[0];
//     if (
//       file &&
//       (file.type === "application/pdf" ||
//         file.type ===
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//         file.type === "text/plain")
//     ) {
//       handleFileUpload({ target: { files: [file] } });
//     }
//   };
//   console.log(location.state);
//   return (
//     <>
//       <div className="container">
//         <Header style={{ width: "100%" }} />
//         {annotateLoading ? <Loading /> : ""}
//         <div className="content" style={{ width: widthIfLoggedIn }}>
//           <div
//             className="history-pagination"
//             style={{ display: displayIfLoggedIn }}
//           >
//             <div
//               className="history-pagination-header"
//               style={{ display: "flex", justifyContent: "space-between" }}
//             >
//               <p>Recent Interactions</p>
//               <button className="new-chat-button" onClick={handleOpenChat}>
//                 <img
//                   src={newChat}
//                   alt="new-chat-icon"
//                   // style={{ paddingRight: "10px" }}
//                 />
//               </button>
//             </div>
//             <ul>
//               {sessions.length > 0 ? (
//                 sessions.map((session) => {
//                   // Mapping keywords to custom titles
//                   const mappedTitle = session.session_title.includes(
//                     "what are the key highlights from this article"
//                   )
//                     ? "Key Highlights"
//                     : session.session_title.includes(
//                         "what can we conclude form this article"
//                       )
//                     ? "Conclusion"
//                     : session.session_title.includes("Summarize this article")
//                     ? "Summarize"
//                     : session.session_title; // Default title if no keyword match

//                   return (
//                     <li
//                       key={session.session_id}
//                       className={
//                         isOnArticlePage &&
//                         session.session_id === activeSessionId
//                           ? "active"
//                           : ""
//                       }
//                       onClick={() => {
//                         handleSessionClick(
//                           // session.article_id,
//                           // session.source,
//                           session.session_id
//                           // user_id,
//                           // session.session_type
//                         );
//                       }}
//                     >
//                       {editingSessionId === session.session_id ? (
//                         <input
//                           type="text"
//                           style={{
//                             padding: "0",
//                             height: "20px",
//                             width: "100%",
//                             fontSize: "16px",
//                             outline: "none",
//                             borderColor: editedTitle ? "#1a82ff" : "#1a82ff",
//                           }}
//                           value={editedTitle}
//                           onChange={handleTitleChange}
//                           onBlur={() => handleSaveEdit(session.session_id)} // Save on blur
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               handleSaveEdit(session.session_id);
//                             }
//                           }}
//                           autoFocus
//                         />
//                       ) : (
//                         <a>
//                           {mappedTitle.slice(0, 25)}
//                           {mappedTitle.length > 25 ? "..." : ""}
//                         </a>
//                       )}
//                       <img
//                         src={pen}
//                         alt="pen-icon"
//                         title="Rename the title"
//                         //icon={faPen}
//                         onClick={() =>
//                           handleEditClick(session.session_id, mappedTitle)
//                         }
//                         style={{ cursor: "pointer", marginLeft: "10px" }}
//                       />
//                     </li>
//                   );
//                 })
//               ) : (
//                 <li>No sessions available</li>
//               )}
//             </ul>
//           </div>

//           {articleData ? (
//             <div
//               className="article-content"
//               onMouseUp={handleMouseUp}
//               ref={contentRef}
//               style={{ height: heightIfLoggedIn }}
//             >
//               <div className="article-title">
//                 <div
//                   style={{
//                     display: "flex",
//                     cursor: "pointer",
//                     marginTop: "1%",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div style={{ display: "flex" }} onClick={handleBackClick}>
//                     <img
//                       src={Arrow}
//                       style={{ width: "14px" }}
//                       alt="arrow-icon"
//                       className="back-arrow-icon"
//                     ></img>
//                     <button className="back-button">Back</button>
//                   </div>
//                   {showConfirmPopup && (
//                     <div className="Article-popup-overlay">
//                       <div className="Article-popup-content">
//                         <p className="Saving-note">Saving Note</p>
//                         <p id="confirming">
//                           Are you sure to leave without saving?
//                         </p>
//                         <div className="Article-confirm-buttons">
//                           <button
//                             className="overlay-cancel-button"
//                             onClick={handleCancelConfirm}
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             className="overlay-ok-button"
//                             onClick={handleOk}
//                           >
//                             Leave
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <div
//                     className="Rate-Article"
//                     style={{ display: displayIfLoggedIn }}
//                   >
//                     <div>
//                       <span>Rate the article </span>
//                     </div>
//                     <div className="rate">
//                       {[5, 4, 3, 2, 1].map((value) => {
//                         const existingRating =
//                           Array.isArray(ratingsList) &&
//                           ratingsList.find((item) => item.uniqueId === uniqueId)
//                             ?.rating;

//                         return (
//                           <React.Fragment key={value}>
//                             <input
//                               type="radio"
//                               id={`star${value}-${uniqueId}`}
//                               name={`rate_${uniqueId}`}
//                               value={value}
//                               checked={existingRating === value}
//                               onChange={() =>
//                                 handleRatingChange(uniqueId, value)
//                               }
//                               // disabled={!!existingRating} // Disable if a rating already exists
//                             />
//                             <label
//                               htmlFor={`star${value}-${uniqueId}`}
//                               title={`${value} star`}
//                             />
//                           </React.Fragment>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ArticleTitle-Bookmark">
//                   <p
//                     style={{
//                       marginTop: "0",
//                       marginBottom: "0",
//                       color: "#0071bc",
//                       fontSize: "20px",
//                     }}
//                   >
//                     {articleData.article.article_title}
//                   </p>
//                   <FontAwesomeIcon
//                     icon={
//                       isArticleBookmarked(id).isBookmarked
//                         ? solidBookmark
//                         : regularBookmark
//                     }
//                     size="l"
//                     style={{
//                       color: isArticleBookmarked(id).isBookmarked
//                         ? "#0071bc"
//                         : "black",
//                       cursor: "pointer",
//                       display: displayIfLoggedIn,
//                     }}
//                     onClick={() =>
//                       handleBookmarkClick(
//                         id,
//                         articleData.article.article_title,
//                         source || "PubMed"
//                       )
//                     }
//                     title={
//                       isArticleBookmarked(id).isBookmarked
//                         ? "Bookmarked"
//                         : "Bookmark this article"
//                     }
//                   />

//                   {isModalOpen && (
//                     <div className="bookmark-modal-overlay">
//                       <div className="modal-content">
//                         {/* Existing Collections */}
//                         <div className="bookmark-p">
//                           <p className="bookmark-para">Bookmarks</p>
//                         </div>

//                         {/* Create New Collection */}
//                         <h4>Create a new collection:</h4>
//                         <input
//                           type="text"
//                           value={newCollectionName}
//                           onChange={(e) => setNewCollectionName(e.target.value)}
//                           placeholder="New collection name"
//                         />
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "20px",
//                             marginBottom: "15px",
//                           }}
//                         >
//                           <button
//                             onClick={handleCreateNewCollection}
//                             disabled={!newCollectionName}
//                           >
//                             Create
//                           </button>
//                         </div>

//                         {Object.keys(collections).length > 0 && (
//                           <>
//                             <h4>Save to existing collection:</h4>

//                             {/* Search bar for collections */}
//                             <input
//                               type="text"
//                               value={searchCollection}
//                               onChange={(e) =>
//                                 setSearchCollection(e.target.value)
//                               }
//                               placeholder="Search collections"
//                               style={{
//                                 marginBottom: "10px",
//                                 padding: "8px 0 8px 8px",
//                               }}
//                             />

//                             {/* Filter collections based on search term */}
//                             <ul className="bookmark-existing-collections">
//                               {Object.keys(collections)
//                                 .filter((collectionName) =>
//                                   collectionName
//                                     .toLowerCase()
//                                     .includes(searchCollection.toLowerCase())
//                                 )
//                                 .map((collectionName, index) => (
//                                   <ul key={index}>
//                                     <li
//                                       onClick={() =>
//                                         handleSaveToExisting(collectionName)
//                                       }
//                                     >
//                                       <span className="collection-name">
//                                         {collectionName}
//                                       </span>
//                                       <span className="collection-article-count">
//                                         {collections[collectionName].length}{" "}
//                                         articles
//                                       </span>
//                                     </li>
//                                   </ul>
//                                 ))}
//                             </ul>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div
//                 className="meta"
//                 style={{ height: !isLoggedIn ? "68vh" : undefined }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     fontSize: "14px",
//                     color: "grey",
//                     marginBottom: "5px",
//                   }}
//                 >
//                   {articleData.article.publication_type ? (
//                     <span>
//                       Publication Type :
//                       <strong style={{ color: "black" }}>
//                         {articleData.article.publication_type.join(", ")}
//                       </strong>
//                     </span>
//                   ) : (
//                     ""
//                   )}
//                   <span style={{ color: "#2b9247" }}>
//                     {type === "bioRxiv_id" && "BioRxiv ID"}
//                     {type === "pmid" && "PMID"}
//                     {type === "plos_id" && "PLOS ID"} : {id}
//                   </span>{" "}
//                 </div>

//                 {articleData.article.abstract_content && (
//                   <>
//                     <Typography
//                       variant="h4"
//                       gutterBottom
//                       style={{
//                         fontSize: "18px",
//                         marginBottom: "0 ",
//                         marginTop: "1%",
//                       }}
//                     >
//                       Abstract
//                     </Typography>
//                     <p>
//                       {renderContentInOrder(
//                         articleData.article.abstract_content,
//                         true
//                       )}
//                     </p>
//                   </>
//                 )}
//                 {/* <div className="content-brake"></div>  */}
//                 {articleData.article.body_content &&
//                   renderContentInOrder(articleData.article.body_content, true)}

//                 {showStreamingSection && (
//                   <div className="streaming-section">
//                     <div className="streaming-content">
//                       {chatHistory.map((chat, index) => (
//                         <div key={index}>
//                           <div className="query-asked">
//                             <span>
//                               {chat.query === "Summarize this article"
//                                 ? "Summarize"
//                                 : chat.query ===
//                                   "what can we conclude form this article"
//                                 ? "Conclusion"
//                                 : chat.query ===
//                                   "what are the key highlights from this article"
//                                 ? "Key Highlights"
//                                 : chat.query}
//                             </span>
//                           </div>

//                           <div
//                             className="response"
//                             style={{ textAlign: "left" }}
//                           >
//                             {/* Check if there's a response, otherwise show loading dots */}
//                             {chat.response ? (
//                               <>
//                                 <span>
//                                   <ReactMarkdown>{chat.response}</ReactMarkdown>
//                                 </span>
//                               </>
//                             ) : (
//                               <div className="loading-dots">
//                                 <span>•••</span>
//                               </div>
//                             )}

//                             <div ref={endOfMessagesRef} />
//                           </div>
//                         </div>
//                       ))}
//                       {/* This div will act as the reference for scrolling */}
//                     </div>
//                   </div>
//                 )}
//                 <div
//                   ref={popupRef}
//                   className="popup-button"
//                   style={{
//                     position: "absolute",
//                     display: "none",
//                     backgroundColor: "#afa7a7",
//                     // padding: "5px",
//                     color: "white",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                   //onClick={handleSaveToNote}
//                 >
//                   <button
//                     onClick={handleSaveToNote}
//                     className="Popup-buttons"
//                     title="Send to Notes"
//                   >
//                     <span className="send-to-notes">Send to notes</span>
//                     <LiaTelegramPlane size={20} color="black" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="derive-article-content">
//               {/* Conditionally render file upload if chatHistory is empty */}
//               {chatHistory.length === 0 && (
//                 <div
//                   className={`derive-insights-file-upload ${
//                     isDragging ? "dragging" : ""
//                   }`}
//                   onClick={handleUploadClick}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <img
//                     src={uploadDocx}
//                     style={{ width: "40%" }}
//                     alt="upload-img"
//                   />
//                   <div className="choosing-file">
//                     <input
//                       id="file-upload"
//                       type="file"
//                       accept=".pdf,.docx,.txt"
//                       onChange={handleFileUpload}
//                       style={{ display: "none" }}
//                     />
//                     <span>
//                       Drag & drop files here or <a href="#upload">Upload</a>
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Display File, Query, and Response */}
//               {chatHistory.length > 0 ? (
//                 <div className="streaming-section">
//                   <div className="streaming-content">
//                     <div style={{ display: "flex" }} onClick={handleBackClick}>
//                       <img
//                         src={Arrow}
//                         style={{ width: "14px" }}
//                         alt="arrow-icon"
//                       ></img>
//                       <button className="back-button">Back</button>
//                     </div>
//                     {chatHistory.map((chat, index) => (
//                       <div key={index}>
//                         {/* Display file_url if it exists */}
//                         {chat.file_url ? (
//                           <div className="chat-file">
//                             <div>
//                               <img src={FileIconForDocument} alt="File Icon" />
//                             </div>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                               }}
//                             >
//                               {/* Display the file name and extension from file_url */}
//                               <span>
//                                 <strong>
//                                   {decodeURIComponent(
//                                     chat.file_url.split("/").pop()
//                                   )}
//                                 </strong>
//                               </span>
//                               <span>
//                                 {chat.file_url.split(".").pop().toUpperCase()}
//                               </span>
//                             </div>
//                           </div>
//                         ) : (
//                           chat.file && (
//                             <div className="chat-file">
//                               <div>
//                                 <img
//                                   src={FileIconForDocument}
//                                   alt="File Icon"
//                                 />
//                               </div>
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   flexDirection: "column",
//                                 }}
//                               >
//                                 {/* Display the file name and extension from chat.file.name */}
//                                 <span>
//                                   <strong>{chat.file.name}</strong>
//                                 </span>
//                                 <span>
//                                   {chat.file.name
//                                     .split(".")
//                                     .pop()
//                                     .toUpperCase()}
//                                 </span>
//                               </div>
//                             </div>
//                           )
//                         )}

//                         {/* Display the query */}
//                         <div className="derive-query-asked">
//                           <span>
//                             {chat.query === "Summarize this article"
//                               ? "Summarize"
//                               : chat.query ===
//                                 "What can we conclude from this article"
//                               ? "Conclusion"
//                               : chat.query ===
//                                 "What are the key highlights from this article"
//                               ? "Key Highlights"
//                               : chat.query}
//                           </span>
//                         </div>

//                         {/* Display the response */}
//                         <div className="response" style={{ textAlign: "left" }}>
//                           {chat.response ? (
//                             <span ref={endOfMessagesRef}>
//                               <ReactMarkdown>{chat.response}</ReactMarkdown>
//                             </span>
//                           ) : (
//                             <div className="loading-dots">
//                               <span>•••</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                     {/* <div ref={endOfMessagesRef} /> */}
//                   </div>
//                 </div>
//               ) : (
//                 ""
//               )}
//             </div>
//           )}

//           <div className="right-aside" style={{ display: displayIfLoggedIn }}>
//             {/* <div className="annotate-note">
//               {openAnnotate && (
//                 <div
//                   className="annotate-height"
//                   style={{
//                     height: `${annotateHeight}vh`,
//                   }}
//                 >
//                   <Annotation
//                     openAnnotate={openAnnotate}
//                     annotateData={annotateData}
//                     annotateHeight={annotateHeight}
//                   />
//                   <div
//                     className="annotate-line2"
//                     onMouseDown={handleAnnotateResize}
//                   />
//                 </div>
//               )}
//               {openNotes && (
//                 <div
//                   className="notes-height"
//                   // style={{ height: `${notesHeight - 15}vh` }}
//                 >
//                   <Notes selectedText={savedText} notesHeight={notesHeight} />
//                   <div
//                     className="notes-line1"
//                     onMouseDown={handleNotesResize}
//                   />
//                   <div
//                     className="notes-line2"
//                     onMouseDown={handleNotesResize}
//                   />
//                 </div>
//               )}
//             </div> */}
//             <div className="icons-group">
//               <div
//                 className={`search-annotate-icon ${
//                   openAnnotate ? "open" : "closed"
//                 }`}
//                 onClick={handleAnnotate}
//                 style={{
//                   opacity: annotateData && annotateData.length > 0 ? 1 : 1, // Adjust visibility when disabled
//                 }}
//               >
//                 <img src={annotate} alt="annotate-icon" />
//               </div>
//               <div
//                 className={`notes-icon ${openNotes ? "open" : "closed"}`}
//                 onClick={() => {
//                   handleNotes();
//                 }}
//               >
//                 <img src={notesicon} alt="notes-icon" />
//               </div>
//               {showConfirmIcon && (
//                 <div className="Article-popup-overlay">
//                   <div className="Article-popup-content">
//                     <p className="Saving-note">Saving Note</p>

//                     <p id="confirming">Are you sure to leave without saving?</p>

//                     <div className="Article-confirm-buttons">
//                       <button onClick={handleCancelIcon}>Cancel</button>
//                       <button onClick={handleCloseIcon}>Leave</button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {articleData ? (
//         <div
//           className="article-chat-query"
//           style={{
//             width: openAnnotate || openNotes ? contentWidth : "69%",
//             display: displayIfLoggedIn,
//           }}
//         >
//           <div className="predefined-prompts">
//             <button onClick={() => handlePromptClick("Summarize this article")}>
//               Summarize
//             </button>
//             <button
//               onClick={() =>
//                 handlePromptClick("what can we conclude form this article")
//               }
//             >
//               Conclusion
//             </button>
//             <button
//               onClick={() =>
//                 handlePromptClick(
//                   "what are the key highlights from this article"
//                 )
//               }
//             >
//               Key Highlights
//             </button>
//           </div>
//           <div className="stream-input">
//             <img src={flag} alt="flag-logo" className="stream-flag-logo" />
//             <input
//               type="text"
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             {/* <button onClick={handleAskClick} > */}
//             {loading ? (
//               <CircularProgress
//                 className="button"
//                 size={24}
//                 style={{ marginLeft: "1.5%" }}
//                 color="white"
//               />
//             ) : (
//               <FontAwesomeIcon
//                 className="button"
//                 onClick={handleAskClick}
//                 icon={faTelegram}
//                 size={"xl"}
//               />
//             )}
//             {/* </button> */}
//           </div>
//         </div>
//       ) : (
//         <div
//           className="derive-chat-query"
//           style={{
//             width: openAnnotate || openNotes ? contentWidth : contentWidth,
//             display: displayIfLoggedIn,
//           }}
//         >
//           <div className="derive-predefined-prompts">
//             <button
//               onClick={() => handlePromptWithFile("Summarize this article")}
//               disabled={!isPromptEnabled}
//               style={{
//                 backgroundColor: isPromptEnabled ? "#c4dad2" : "#cccccc",
//                 color: isPromptEnabled ? "#000000" : "#666666",
//               }}
//             >
//               Summarize
//             </button>
//             <button
//               onClick={() =>
//                 handlePromptWithFile("What can we conclude from this article")
//               }
//               disabled={!isPromptEnabled}
//               style={{
//                 backgroundColor: isPromptEnabled ? "#c4dad2" : "#cccccc",
//                 color: isPromptEnabled ? "#000000" : "#666666",
//               }}
//             >
//               Conclusion
//             </button>
//             <button
//               onClick={() =>
//                 handlePromptWithFile(
//                   "What are the key highlights from this article"
//                 )
//               }
//               disabled={!isPromptEnabled}
//               style={{
//                 backgroundColor: isPromptEnabled ? "#c4dad2" : "#cccccc",
//                 color: isPromptEnabled ? "#000000" : "#666666",
//               }}
//             >
//               Key Highlights
//             </button>
//           </div>
//           <div className="file-palcement">
//             {uploadedFile && (
//               <div className="file-showing">
//                 <span className="uploaded-file-indicator">
//                   {uploadedFile.name}
//                   <FontAwesomeIcon
//                     icon={faTimes}
//                     onClick={removeUploadedFile}
//                     className="cancel-file"
//                     color="black"
//                   />
//                 </span>
//               </div>
//             )}
//           </div>
//           <div className="derive-stream-input">
//             {/* <label htmlFor="file-upload" className="custom-file-upload">
//               <TbFileUpload size={25} />
//             </label> */}
//             <label htmlFor="file-upload" className="custom-file-upload">
//               <img
//                 src={upload}
//                 alt="upload-icon"
//                 style={{ paddingLeft: "10px", cursor: "pointer" }}
//               />
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               accept=".pdf,.docx,.txt"
//               onChange={handleFileUpload}
//               style={{ display: "none" }}
//             />
//             <div className="query-file-input">
//               <input
//                 type="text"
//                 placeholder="Ask anything..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyDown={handleDeriveKeyDown}
//               />
//             </div>
//             {loading ? (
//               <CircularProgress
//                 className="button"
//                 size={24}
//                 style={{ marginLeft: "1.5%" }}
//                 color="white"
//               />
//             ) : (
//               <FontAwesomeIcon
//                 className="button"
//                 onClick={handleDeriveClick}
//                 icon={faTelegram}
//                 size={"xl"}
//               />
//             )}
//           </div>
//         </div>
//       )}
//       <div className="ScrollTop">
//         <button onClick={scrollToTop} id="scrollTopBtn" title="Go to top">
//           <FontAwesomeIcon icon={faAnglesUp} />
//         </button>
//       </div>
//     </>
//   );
// };

// export default ArticlePage;
