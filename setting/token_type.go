package setting

import (
	"encoding/json"
	"one-api/common"
)

var TokenType = []map[string]string{

	{
		"type": "TokenTypeIM",
		"icon": "https://robohash.org/b3eb97dd5f077e45bfb4b514058f91ec?set=set4&bgset=&size=200x200",
	},
	{
		"type": "TokenTypeAI",
		"icon": "https://api.adorable.io/avatars/400/b3eb97dd5f077e45bfb4b514058f91ec.png",
	},
	{
		"type": "TokenTypeWallet",
		"icon": "https://gravatar.com/avatar/b3eb97dd5f077e45bfb4b514058f91ec?s=200&d=robohash&r=x",
	},
}

func UpdateTokenTypeByJsonString(jsonString string) error {
	TokenType = make([]map[string]string, 0)
	return json.Unmarshal([]byte(jsonString), &TokenType)
}

func TokenType2JsonString() string {
	jsonBytes, err := json.Marshal(TokenType)
	if err != nil {
		common.SysError("error marshalling TokenType: " + err.Error())
		return "[]"
	}
	return string(jsonBytes)
}
