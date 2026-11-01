import { useParams } from "react-router-dom";

import MatchArena from "../../../../features/rooms/MatchArena";

export default function FriendsLiveArena() {
  const { code } = useParams();
  return <MatchArena mode="friends" code={code} />;
}