# ling-prog-6periodo
{
"rules": {
  ".read": "auth != null", 
  ".write": "auth != null",

  "users": {
    "$uid": {
      ".read": "auth != null && auth.uid == $uid", 
      ".write": "auth != null && auth.uid == $uid",

      "matches": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid",

        "$matchId": {
            "$timeId": {
              ".read": "auth != null && auth.uid == $uid",
              ".write": "auth != null && auth.uid == $uid",
              "players": {
                "$playerId": {
                  ".read": "auth != null && auth.uid == $uid",
                  ".write": "auth != null && auth.uid == $uid"
                }
              }
            }
          }
        }
      }
    }
  }
}
