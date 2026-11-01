import { useLocation, useParams } from "react-router-dom";

import MatchArena from "../../../../features/rooms/MatchArena";

export default function LiveMatch() {
  const { code } = useParams();
  const { state } = useLocation();
  return <MatchArena mode="online" code={code} opponent={state?.opponent} />;
}