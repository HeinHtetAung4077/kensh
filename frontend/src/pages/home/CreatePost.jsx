import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState(null);
  const [aiImg, setAIImg] = useState(null);
  const imgRef = useRef(null);
  const [aiYesNo, setAiYesNo] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Created a post successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // const isPending = false;
  //   const isError = false;

  //   const data = {
  //     profileImg: "/avatars/boy1.png",
  //   };
  // if (!img) setImg(aiImg);
  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("Post created successfully");
    createPost({ text, img });
    setAIImg(null);
    setPrompt("");
    setAiYesNo(false);
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const aiToggle = (e) => {
    e.preventDefault();
    setAiYesNo(!aiYesNo);
  };

  const generateImg = async () => {
    if (prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("/api/v1/aiImg/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt }),
        });

        const data = await response.json();
        // setForm({...form, photo: `${data.photo}`})
        setImg(`${data.photo}`);
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt!!");
    }
  };

  const handleAISubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
    setAIImg(null);
    setPrompt("");
    setAiYesNo(false);
  };

  return (
    <div className="flex flex-col p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <div className="btn btn-primary rounded-full btn-sm text-white px-4">
            <button
              className="btn btn-primary rounded-full btn-sm text-white px-4"
              onClick={aiToggle}
            >
              AI
            </button>
          </div>

          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            onClick={handleSubmit}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </div>
      {aiYesNo && (
        <div className="flex flex-col gap-2 w-full">
          <textarea
            className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
            placeholder="Prompt Here!"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {aiImg && (
            <div className="relative w-72 mx-auto">
              <IoCloseSharp
                className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
              />
              <img
                src={aiImg}
                className="w-full mx-auto h-72 object-contain rounded"
              />
            </div>
          )}

          <div className="flex justify-between border-t py-2 border-t-gray-700">
            <div className="flex gap-1 items-center"></div>

            <button
              className="btn btn-primary rounded-full btn-sm text-white px-4 bg-green-700 hover:bg-green-500"
              onClick={generateImg}
            >
              {generatingImg ? "Generating..." : "Generate"}
            </button>
          </div>

          {isError && <div className="text-red-500">{error.message}</div>}
        </div>
      )}
    </div>
  );
};
export default CreatePost;
