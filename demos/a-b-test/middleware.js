import { NextResponse } from "next/server";

export default function middleware(req) {
  const bucketName = "test_bucket";
  const path = req.nextUrl.pathname;

  // Get the bucket from the cookie
  let bucket = req.cookies.get(bucketName);
  let hasBucket = !!bucket;

  // If there's no active bucket in cookies or its value is invalid, get a new one
  if (!bucket) {
    bucket = Math.random() <= 0.5 ? "a" : "b";
    hasBucket = false;
  }

  // Create a rewrite to the page matching the bucket
  let url;
  const pathArr = path.split("/");
  if (pathArr[1] === "_next") {
    let newPath = pathArr.splice(2);
    
    //Hardcoded url's based on the bucket - sent to Netlify branch deploys. This could be set in env vars.
    url = `https://${bucket}--next-movie-db.netlify.app/${newPath.join("/")}`;
  } else {
    url = `https://${bucket}--next-movie-db.netlify.app${path}`;
  }

  let res = NextResponse.rewrite(url);
  
  // Add the bucket to the response cookies if it's not there
  // or if its value was invalid
  if (!hasBucket) {
    res.cookies.set(bucketName, bucket);
  }

  return res;
}
