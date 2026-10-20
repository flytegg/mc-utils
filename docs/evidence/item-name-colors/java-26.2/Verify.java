import java.nio.file.*;
import net.minecraft.SharedConstants;
import net.minecraft.server.Bootstrap;
import net.minecraft.data.registries.VanillaRegistries;
import net.minecraft.commands.*;
import net.minecraft.server.permissions.PermissionSet;
import net.minecraft.commands.arguments.item.ItemParser;
import net.minecraft.nbt.*;
import net.minecraft.world.level.storage.loot.functions.*;
import net.minecraft.core.component.DataComponents;
import com.mojang.brigadier.StringReader;
public class Verify {
 public static void main(String[] args) throws Exception {
  SharedConstants.tryDetectVersion(); Bootstrap.bootStrap();
  var registries = VanillaRegistries.createLookup();
  
  net.minecraft.core.registries.BuiltInRegistries.DATA_COMPONENT_INITIALIZERS.build(registries).forEach(pending -> pending.apply());
  var commands = new Commands(Commands.CommandSelection.ALL, Commands.createValidationContext(registries));
  var source = Commands.createCompilationContext(PermissionSet.ALL_PERMISSIONS);
  for (var line : Files.readAllLines(Path.of(args[0]))) {
   if (line.isBlank()) continue;
   var result = commands.getDispatcher().parse(line.replaceFirst("^/", ""), source);
   Commands.validateParseResults(result);
   if (result.getContext().getCommand() == null) throw new AssertionError("Incomplete command: " + line);
   System.out.println("PARSED " + line);
  }
  var ops = registries.createSerializationContext(NbtOps.INSTANCE);
  var modifier = LootItemFunctions.ROOT_CODEC.parse(ops, TagParser.parseCompoundFully(Files.readString(Path.of(args[1])))).getOrThrow();
  var stack = new ItemParser(registries).parse(new StringReader("minecraft:netherite_sword[minecraft:damage=17,minecraft:enchantments={\"minecraft:sharpness\":5},minecraft:custom_data={owner:\"Daemon\",serial:9223372036854775807L},minecraft:lore=[{text:\"Keep this lore\"}]]")).createItemStack(1);
  var before = stack.copy();
  ((SetNameFunction)modifier).run(stack, null);
  if (!stack.get(DataComponents.CUSTOM_NAME).getString().equals("Emberblade")) throw new AssertionError("Name mismatch");
  stack.remove(DataComponents.CUSTOM_NAME);
  if (!net.minecraft.world.item.ItemStack.matches(before, stack)) throw new AssertionError("Non-name item data changed");
  System.out.println("PASS: real set_name function preserved enchantments, damage, lore, custom data, and count");
 }
}
