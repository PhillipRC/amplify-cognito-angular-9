import { Pipe, PipeTransform } from '@angular/core';

/**
 * Used by a template to find user attributes by name
 * Example: {{ item | userAttributes: "email" }}
 */
@Pipe({ name: 'userAttributes' })
export class UserAttributes implements PipeTransform {
    transform(input: any, key: string): string {
        const found = input.Attributes.find((element: { Name: string; }) => element.Name === key);
        if (found) {
            return found.Value;
        }
        return '';
    }
}
