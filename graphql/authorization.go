package graphql

import (
	"fmt"

	"github.com/graphql-go/graphql"
)

type authorizationKey string

const (
	// PublicAccess mean source and access from everyone
	publicAccess = authorizationKey("PUBLIC_ACCESS")

	// AdminAccess mean only admin can view or access source
	adminAccess = authorizationKey("ADMIN_ACCESS")
)

func wrapFieldWithAuthorization(f graphql.Field, l authorizationKey) {
	oldResolve := f.Resolve

	f.Resolve = graphql.FieldResolveFn(func(p graphql.ResolveParams) (interface{}, error) {
		ctx := getContextFromParams(p)

		switch l {
		case publicAccess:
			return oldResolve(p)
		case adminAccess:
			{
				if ctx.user != nil {
					return oldResolve(p)
				}
				return nil, fmt.Errorf("Unauthorization")
			}
		default:
			return oldResolve(p)
		}
	})
}
