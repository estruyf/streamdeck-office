# Stream Desk Office Plugin

https://developer.elgato.com/documentation/stream-deck/sdk/exporting-your-plugin/

```
./DistributionTool -b -i com.estruyf.office.sdPlugin -o ./
```

## Location

`/Users/<user>/Library/Application Support/com.elgato.StreamDeck/Plugins`

## Testing

`defaults write com.elgato.StreamDeck html_remote_debugging_enabled -bool YES`

`defaults write com.elgato.StreamDeck html_remote_debugging_enabled -bool NO`

http://localhost:23654/

## Port

28196