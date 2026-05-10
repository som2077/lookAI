import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/hooks/useSupabase";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

type Post = {
  id: string;
  user_id: string;
  content: string | null;
  created_at: string;
};

export default function PostsScreen() {
  const { user } = useUser();
  const { supabase, isInitializing } = useSupabase();
  const { data: posts, loading, error, refetch } = useSupabaseQuery<Post>("posts", {
    apply: (query) => query.order("created_at", { ascending: false }),
    enabled: !!user,
  });

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const onCreatePost = async () => {
    if (!user) {
      setSaveError("You must be signed in.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const { error: insertError } = await supabase.from("posts").insert({
      user_id: user.id,
      content,
    });

    if (insertError) {
      setSaveError(insertError.message);
      setIsSaving(false);
      return;
    }

    setContent("");
    setIsSaving(false);
    await refetch();
  };

  if (isInitializing || loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="mb-2 text-2xl font-bold">Posts</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write something..."
        className="mb-3 rounded-md border border-gray-300 px-3 py-2"
      />
      <Button title={isSaving ? "Saving..." : "Create post"} onPress={onCreatePost} disabled={isSaving} />

      {(error || saveError) && (
        <Text className="mt-3 text-red-500">{saveError ?? error?.message}</Text>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View className="rounded-md border border-gray-200 p-3">
            <Text className="text-xs text-gray-500">{item.user_id}</Text>
            <Text className="mt-1 text-base">{item.content ?? "(empty)"}</Text>
            <Text className="mt-1 text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
