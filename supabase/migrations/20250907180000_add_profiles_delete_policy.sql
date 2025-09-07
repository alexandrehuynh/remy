-- Add DELETE policy to profiles table to allow users to delete their own profiles
-- This resolves the MISSING_DELETE_POLICY security issue identified by LLM Database Check

CREATE POLICY "Users can delete their own profile" 
ON "public"."profiles" 
FOR DELETE 
USING (auth.uid() = user_id);