"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { getUserIdFromToken } from "@/utils/helpers";
import { useUserProfile } from "@/hooks/useUsers";
import { updateUserProfile } from "@/features/api/users/route";
import toast from "react-hot-toast";

const Profile = () => {
  const userId = getUserIdFromToken();
  const { data: user, isLoading, error, refetch } = useUserProfile(userId);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // useEffect(() => {
  //   const fetchUserProfile = async() => {
  //     console.log("Fteching user profile")
  //     const response = await fetch('https://2c93-223-233-64-139.ngrok-free.app/users/675ac767944cba1d9bdbb15f/profile', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json', // Include headers if necessary
  //         // 'Authorization': `Bearer ${yourToken}`, // If your API requires an auth token
  //       },
  //     })
  //       .then(async(response) => {
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }
  //         const json = await response.json()
  //         console.log("response json", json) ; // Parse the response body as JSON
  //       })
  //       .then((data) => {
  //         console.log('Response Data:', data);
  //         // Use the data as needed in your frontend
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //       });

  //     // console.log("response", response)
  //   }
  //   fetchUserProfile();
  // }, [])

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    await updateUserProfile(userId, name, profilePhoto);
    toast.success("Profile updated successfully");
    setIsDialogOpen(false); // Close the dialog box
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user profile</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role?.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={updateUserHandler}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses?.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            user?.enrolledCourses?.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
