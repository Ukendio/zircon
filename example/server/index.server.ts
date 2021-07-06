import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconServer } from "@zircon";
import ZirconPrint from "BuiltIn/Print";
import { ZirconFunctionBuilder } from "Class/ZirconFunctionBuilder";
import { ZirconNamespaceBuilder } from "Class/ZirconNamespaceBuilder";
import delayAsync from "Client/BuiltInConsole/DelayAsync";

Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.WriteTo(Zircon.Log.Console())
		.EnrichWithProperty("Version", PKG_VERSION)
		.Create(),
);

ZirconServer.Registry.RegisterFunction(
	new ZirconFunctionBuilder("kill").AddArguments("player?").Bind((context, player) => {
		const target = player ?? context.GetExecutor();
		target.Character?.BreakJoints();
		Log.Info("Killed {target}", target);
	}),
	[ZirconServer.Registry.User],
);

ZirconServer.Registry.RegisterFunction(
	new ZirconFunctionBuilder("print_message")
		.AddArguments("string")
		.Bind((context, message) => Log.Info("Zircon says {Message} from {Player}", message, context.GetExecutor())),
	[ZirconServer.Registry.User],
);

ZirconServer.Registry.RegisterNamespace(
	new ZirconNamespaceBuilder("example")
		.AddFunction(
			new ZirconFunctionBuilder("print").Bind((context, ...args) => {
				Log.Info("[Example print] " + args.map((a) => tostring(a)).join(" "));
			}),
		)
		.AddFunction(
			new ZirconFunctionBuilder("test").Bind((context) => {
				Log.Info("Test!");
			}),
		)
		.AddFunction(ZirconPrint)
		.Build(),
	[ZirconServer.Registry.User],
);

ZirconServer.Registry.RegisterFunction(
	new ZirconFunctionBuilder("print").Bind((context, ...args) => {
		Log.Info(args.map((a) => tostring(a)).join(" "));
	}),
	[ZirconServer.Registry.User],
);

delayAsync(5).then(() => {
	Log.Verbose("A verbose message. Yes?");
	Log.Debug("A debug message, yes");
	Log.Info("Hello, {Test}! {Boolean} {Number} {Array}", "Test string", true, 10, [1, 2, 3, [4]]);
	Log.Warn("Warning {Lol}", "LOL!");
	Log.Error("ERROR LOL {Yes}", true);
	Log.Fatal("Fatal message here");
});

// game.GetService("Players").PlayerAdded.Connect((player) => {
// 	ZirconServer.Registry.AddPlayerToGroups(player, ["creator"]);
// });

// for (const player of game.GetService("Players").GetPlayers()) {
// 	Zircon.Server.Registry.AddPlayerToGroups(player, ["creator"]);
// }
