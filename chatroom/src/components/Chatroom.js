// Importing necessary modules and functions from React and Firebase
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase.js'; // Importing Firebase database and authentication
import { collection, onSnapshot, query, addDoc, orderBy, doc, updateDoc } from 'firebase/firestore'; // Importing Firestore functionalities
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Defining a functional component named Chatroom
function Chatroom() {

    // Declaring state variables using the useState hook
    const [text, setText] = useState(""); // State variable for the text input field
    const [userId, setUserId] = useState(""); // State variable for the current user's ID
    const [localMessages, setLocalMessages] = useState([]); // State variable for storing local messages
    const [localImage, setLocalImage] = useState(null);
    const adminList = ["cVnw8sMj83e0iJdybuc3GIm5x7s1"];

    const storage = getStorage();

    useEffect(() => {

        // Setting the user ID state variable to the current user's UID (User ID)
        setUserId(auth?.currentUser?.uid);

        // Creating a Firestore query to retrieve messages from the "chats" collection
        const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

        // Subscribing to real-time updates on the Firestore query using onSnapshot
        const unsubscribe = onSnapshot(q, (querySnapshot) => {

            // Declaring an empty array to store retrieved messages
            let messages = [];

            // Iterating over each document in the query snapshot
            querySnapshot.forEach((doc) => {
                console.log(doc.id, "=>", doc.data());

                // Pushing the document data (message) to the messages array
                messages.push({ mid: doc.id, ...doc.data() });
            });

            // Updating the localMessages state variable with the retrieved messages
            setLocalMessages(messages);
        });

        // Returning a cleanup function to unsubscribe from Firestore updates when the component unmounts
        return (() => {
            unsubscribe(); // Unsubscribing from Firestore updates
        })
    }, [])

    return (
        <div>
            {/* Outer container */}
            <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column' }}>
                {/* Container for message display */}
                <div style={{ flex: 1, marginLeft: 24, marginRight: 24, overflow: 'auto', marginBottom: 24 }}>
                    {/* Container for messages either user or other depends on ternary */}
                    {localMessages.map((localMessage) => (
                        <div style={{ display: 'flex', flex: 1, justifyContent: userId === localMessage.uid ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                minHeight: 52,
                                width: 600,
                                backgroundColor: userId === localMessage.uid ? 'blue' : (localMessage.like === true ? 'yellow': 'red' ),
                                marginTop: 24,
                                paddingLeft: 24,
                                paddingRight: 24,
                                borderRadius: 12
                            }}>
                                <p>{localMessage.content}</p>
                                {localMessage?.image && localMessage.image.length > 0 &&
                                    <img style={{ width: '100%', height: 'auto', marginBottom: 24 }} src={localMessage.image} />}
                                    {(userId !== localMessage.uid) && (adminList.includes(userId)) && (localMessage.like === false ) && 
                                    <button style={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontSize: 22,
                                        marginBottom: 24,
                                        borderWidth: 0,
                                        fontWeight: 'bold',
                                        borderRadius: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        paddingLeft: 8,
                                        paddingRight: 8
                                    }} onClick={async () => {
                                        //need doc UID
                                        const docRef = doc(db, "chats", localMessage.mid);
                                        await updateDoc(docRef, {
                                            like: true
                                        });
                                    }}>Like</button>
                                    }
                            </div>
                        </div>)
                    )}
                </div>
                {/* Container for input and send button */}
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 24 }}>
                    <form style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 1
                    }}
                        onSubmit={async (e) => {
                            //prevent default page load
                            e.preventDefault();
                            //image
                            let image = '';
                            // Creating a timestamp
                            const timestamp = Date.now();
                            // Getting the message content from the input field
                            const content = text;
                            //get image
                            // const image = "https://firebasestorage.googleapis.com/v0/b/chatroomapp-22024961.appspot.com/o/1702644004344.jpeg?alt=media&token=8f485e1d-d409-40c0-a2e8-b65685d0d473";
                            // Getting the user ID
                            const uid = userId;

                            // Check if there's a local image available
                            if(localImage) {
                                // Generate a unique filename for the image
                                const uniqueLocalImage = `${localImage.name}_${Math.random().toString(36)}`;
                                 // Create a reference to the Firebase Storage location where the image will be stored
                                const storageRef = ref(storage, `/images/${uniqueLocalImage}`);
                                 // Upload the image to Firebase Storage
                                await uploadBytes(storageRef, localImage).then(async (snapshot) => {
                                   // Once the upload is complete, get the download URL of the image
                                    const firebaseUrl = await getDownloadURL(storageRef);
                                    console.log('firebaseUrl', firebaseUrl);
                                   // Create a message object with the image URL and other data
                                    const message = { content, timestamp, uid, image: firebaseUrl };
                                    // Add the message to the "chats" collection in Firestore
                                    const docRef = await addDoc(collection(db, "chats"), message);
                                });
                            } else {
                                // If there's no local image, create a message object with other data
                                const message = { content, timestamp, uid, image };
                                // Add the message to the "chats" collection in Firestore
                                const docRef = await addDoc(collection(db, "chats"), message);
                            }
                                //empty
                                setText("");
                                setLocalImage(null);
                        }}>
                        {/* Input field for typing messages */}
                    <input style={{
                        flex: 11,
                        height: 32,
                        fontSize: 28
                    }} type="text" value={text} onChange={(value) => {
                        setText(value.target.value);
                    }} />
                    {/* Image input */}
                    <input
                        key={Date.now()}
                        style={{ flex: 1 }}
                        type="file"
                        onChange={(e) => {
                            const image = e.target.files[0];
                            setLocalImage(image);
                        }}
                    />
                    {/* Send button */}
                    <button type='submit' style={{
                        flex: 1,
                        backgroundColor: 'blue',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18,
                        borderWidth: 0
                    }}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatroom;