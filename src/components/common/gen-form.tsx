"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Switch } from "../ui/switch";
import { ColorPickers } from "../blocks/color-pickers";
import { Provider } from "@/contexts/image-context";
import { Slider } from "../ui/slider";

export function GenForm<T extends z.ZodTypeAny>({
  provider,
  title,
  schema,
  submitText,
  isSubmitting,
  onSubmit,
}: {
  provider: Provider;
  title?: string;
  schema: T;
  submitText: string;
  onSubmit: (values: z.infer<T> & { apiKey: string }) => void;
  isSubmitting: boolean;
}) {
  const [_, forceUpdate] = useState(0);
  const [rememberApiKey, setRememberApiKey] = useState(false);

  const schemaWithApiKey = schema.and(
    z.object({ apiKey: z.string().min(1).default("") })
  );

  const form = useForm({
    resolver: zodResolver(schemaWithApiKey),
    defaultValues: { ...getDefaults(schemaWithApiKey) },
  });

  function generateField(
    schema: z.ZodTypeAny,
    {
      name,
      optional,
      discriminatorValue,
    }: {
      name?: string;
      optional?: boolean;
      discriminatorValue?: string;
    }
  ): React.ReactNode {
    if (schema instanceof z.ZodObject) {
      return Object.entries(schema.shape).map(([name, schema]: [string, any]) =>
        generateField(schema, {
          name,
          optional,
          discriminatorValue,
        })
      );
    }
    if (schema instanceof z.ZodDefault) {
      return generateField(schema._def.innerType, {
        name,
        optional,
        discriminatorValue,
      });
    }
    if (schema instanceof z.ZodOptional) {
      return generateField(schema._def.innerType, {
        name,
        optional: true,
        discriminatorValue,
      });
    }
    if (schema instanceof z.ZodIntersection) {
      return [
        generateField(schema._def.left, {
          name,
          optional,
          discriminatorValue,
        }),
        generateField(schema._def.right, {
          name,
          optional,
          discriminatorValue,
        }),
      ];
    }
    if (schema instanceof z.ZodDiscriminatedUnion) {
      const discriminators = z.enum(
        Array.from(schema._def.optionsMap.keys()) as [string, ...string[]]
      );
      const curDiscriminatorValue = form.getValues()[schema._def.discriminator];
      const selected = schema._def.optionsMap.get(curDiscriminatorValue);
      return [
        generateField(discriminators, {
          name: schema._def.discriminator,
          discriminatorValue: curDiscriminatorValue,
        }),
        ...Object.entries(selected?.shape ?? {})
          .filter(([name]) => name !== schema._def.discriminator)
          .map(([name, schema]) =>
            generateField(schema, {
              name,
              optional,
              // discriminatorValue: curDiscriminatorValue,
            })
          ),
      ];
    }
    if (schema instanceof z.ZodEffects) {
      if (schema._def.description !== "image") {
        return generateField(schema._def.schema, {
          name,
          optional,
          discriminatorValue,
        });
      }
    }

    if (!name) return null;

    return (
      <FormField
        // key={discriminator ? `${discriminator}-${name}` : name}
        key={name}
        control={form.control}
        // @ts-expect-error
        name={name}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel htmlFor={name} className="text-primary">
                {name[0].toUpperCase() + name.slice(1)}
              </FormLabel>
              <FormMessage className="leading-3" />
              {optional && (
                <FormDescription className="text-xs">optional</FormDescription>
              )}
            </div>
            <FormControl>
              {schema instanceof z.ZodString ? (
                schema.description === "textarea" ? (
                  <Textarea id={name} {...field} />
                ) : (
                  <Input
                    id={name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )
              ) : schema instanceof z.ZodNumber ? (
                schema.description?.includes("range") ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id={name}
                      type="number"
                      className="w-24"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      max={schema.maxValue ?? undefined}
                      min={schema.minValue ?? undefined}
                      step={Number(schema.description?.split(",")[1])}
                    />
                    <Slider
                      value={[field.value]}
                      onValueChange={(e) => field.onChange(Number(e[0]))}
                      min={schema.minValue ?? undefined}
                      max={schema.maxValue ?? undefined}
                      step={Number(schema.description?.split(",")[1])}
                    />
                  </div>
                ) : (
                  <Input
                    id={name}
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                )
              ) : schema instanceof z.ZodBoolean ? (
                <Switch
                  id={name}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              ) : schema instanceof z.ZodEnum ? (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (discriminatorValue) {
                      forceUpdate((prev) => prev + 1);
                    }
                  }}
                  disabled={schema.options.length === 1}
                >
                  <SelectTrigger id={name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {schema.options.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : name === "colors" && schema instanceof z.ZodArray ? (
                <ColorPickers
                  id={name}
                  onChange={(colors) =>
                    field.onChange(colors.map((c) => [c.r, c.g, c.b]))
                  }
                />
              ) : schema instanceof z.ZodEffects ? (
                <Input
                  id={name}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0] ?? undefined);
                  }}
                />
              ) : null}
            </FormControl>
          </FormItem>
        )}
      />
    );
  }

  useEffect(() => {
    const apiKey = localStorage.getItem(`${provider}-api-key`);
    if (apiKey) {
      setRememberApiKey(true);
      // @ts-expect-error
      form.setValue("apiKey", apiKey);
    }
  }, [rememberApiKey, provider]);

  return (
    <Card className="w-full border-none shadow-none py-4">
      <CardContent className="px-0">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((data) => {
              if (!rememberApiKey) {
                localStorage.removeItem(`${provider}-api-key`);
              } else {
                localStorage.setItem(`${provider}-api-key`, data.apiKey);
              }
              onSubmit(data as z.infer<T> & { apiKey: string });
            })}
          >
            <FormField
              key="apiKey"
              control={form.control}
              // @ts-expect-error
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      {provider === "openai"
                        ? "OpenAI"
                        : provider === "ideogram"
                        ? "Ideogram"
                        : provider === "recraft"
                        ? "Recraft"
                        : provider === "black-forest-labs"
                        ? "Black Forest Labs"
                        : provider === "fal"
                        ? "Fal"
                        : null}{" "}
                      API Key
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        remember
                      </span>
                      <Switch
                        checked={rememberApiKey}
                        onCheckedChange={(checked) => {
                          setRememberApiKey(checked);
                        }}
                      />
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <InfoCircledIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This will save your API key in the browser&apos;s
                            local storage.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {title && (
              <div className="flex flex-col pt-6">
                <h3 className="font-semibold">{title}</h3>
              </div>
            )}

            {generateField(schema, {})}

            <div className="flex justify-center">
              <Button
                className={cn(
                  "font-normal",
                  isSubmitting && "animate-pulse disabled:opacity-75"
                )}
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {submitText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function getDefaults<Schema extends z.ZodTypeAny>(
  schema: Schema
): z.infer<Schema> {
  if (schema instanceof z.ZodIntersection) {
    return {
      ...getDefaults(schema._def.left),
      ...getDefaults(schema._def.right),
    };
  }
  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodLiteral) {
          return [key, value._def.value];
        }
        if (value instanceof z.ZodDefault)
          return [key, value._def.defaultValue()];
        return [key, undefined];
      })
    );
  }
  if (schema instanceof z.ZodDefault) {
    return schema._def.defaultValue();
    // if (schema._def.innerType instanceof z.ZodDiscriminatedUnion) {
    //   const discriminator = schema._def.innerType._def.discriminator;
    //   const discriminatorValue = schema._def.defaultValue()[discriminator];
    //   return getDefaults(
    //     schema._def.innerType._def.optionsMap.get(discriminatorValue)
    //   );
    // }
  }
  return undefined;
}
